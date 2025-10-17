const { PrismaClient, Role, OrderStatus } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// ---------- utils ----------
function argNum(name, def) {
  const m = process.argv.find(a => a.startsWith(`--${name}=`));
  if (!m) return def;
  const v = Number(m.split('=')[1]);
  return Number.isFinite(v) ? v : def;
}
function argStr(name, def) {
  const m = process.argv.find(a => a.startsWith(`--${name}=`));
  return m ? m.split('=')[1] : def;
}
function hasFlag(name) {
  return process.argv.includes(`--${name}`) || process.argv.includes(`--${name}=true`);
}
function startOfDay(offset = 0) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  d.setDate(d.getDate() + offset);
  return d;
}
function endOfDay(offset = 0) {
  const d = startOfDay(offset);
  d.setDate(d.getDate() + 1);
  return d;
}
function round2(n) { return Math.round(n * 100) / 100; }
function splitInChunks(total, n) {
  if (n <= 1) return [round2(total)];
  const base = Math.floor((total / n) * 100) / 100;
  const arr = Array(n).fill(base);
  const diff = round2(total - base * n);
  // distribui os centavos restantes
  for (let i = 0; i < Math.round(diff * 100); i++) {
    arr[i % n] = round2(arr[i % n] + 0.01);
  }
  return arr;
}

async function main() {
  // ---------- args ----------
  const ACCOUNT_ID = argStr('account', 'acct-demo');
  const OFFSET = argNum('offset', 0);
  const APPEND = hasFlag('append');

  // multiplicadores (fallback quando não há absolutos)
  const SALES_M = argNum('sales', 1);
  const ADS_M   = argNum('ads', 1);
  const EXP_M   = argNum('exp', 1);

  // valores absolutos (opcionais)
  const APPROVED_N = argNum('approved', null);
  const PENDING_N  = argNum('pending',  null);
  const REFUND_N   = argNum('refunded', null);

  const ADS_TOTAL  = argNum('adsAmount',  null);  // total de adspend do dia
  const EXP_TOTAL  = argNum('expAmount',  null);  // total de despesas do dia
  const ADS_COUNT  = argNum('adsCount', null);    // dividir o total em N lançamentos
  const EXP_COUNT  = argNum('expCount', null);

  // ---------- janela do dia ----------
  const t0 = startOfDay(OFFSET);
  const t1 = endOfDay(OFFSET);

  // ---------- usuário/conta base ----------
  const passwordHash = await bcrypt.hash('dev123456', 10);
  const user = await prisma.user.upsert({
    where: { email: 'dev@example.com' },
    update: {},
    create: { name: 'Dev', email: 'dev@example.com', password: passwordHash, role: Role.USER },
  });

  await prisma.account.upsert({
    where: { id: ACCOUNT_ID },
    update: {},
    create: { id: ACCOUNT_ID, platform: 'demo', userId: user.id },
  });

  // ---------- limpeza do dia (idempotência) ----------
  if (!APPEND) {
    await prisma.order.deleteMany({ where: { accountId: ACCOUNT_ID, occurredAt: { gte: t0, lt: t1 } } });
    await prisma.adspend.deleteMany({ where: { accountId: ACCOUNT_ID, date: { gte: t0, lt: t1 } } });
    await prisma.expense.deleteMany({ where: { accountId: ACCOUNT_ID, date: { gte: t0, lt: t1 } } });
  }

  // ---------- ORDERS ----------
  // baseline (se não usar absolutos)
  // APROVADOS: 150 + 230.5
  // PENDENTE:  99.9
  // REEMB:     45
  const defaultApproved = [150, 230.5].map(v => round2(v * SALES_M));
  const defaultPending  = [round2(99.9 * SALES_M)];
  const defaultRefunded = [round2(45 * SALES_M)];

  let approvedList, pendingList, refundedList;

  if (APPROVED_N != null || PENDING_N != null || REFUND_N != null) {
    // modo "absoluto por contagem"
    approvedList = Array(Math.max(0, APPROVED_N ?? defaultApproved.length)).fill(0).map((_, i) => {
      const base = defaultApproved[i % defaultApproved.length] || defaultApproved[0] || round2(150 * SALES_M);
      return base;
    });
    pendingList = Array(Math.max(0, PENDING_N ?? defaultPending.length)).fill(0).map((_, i) => {
      const base = defaultPending[i % defaultPending.length] || defaultPending[0] || round2(99.9 * SALES_M);
      return base;
    });
    refundedList = Array(Math.max(0, REFUND_N ?? defaultRefunded.length)).fill(0).map((_, i) => {
      const base = defaultRefunded[i % defaultRefunded.length] || defaultRefunded[0] || round2(45 * SALES_M);
      return base;
    });
  } else {
    // modo multiplicador (como antes)
    approvedList = defaultApproved;
    pendingList  = defaultPending;
    refundedList = defaultRefunded;
  }

  const stamp = (i) => new Date(t0.getTime() + i * 60 * 60 * 1000); // 1h de diferença só p/ variar

  for (const [i, v] of approvedList.entries()) {
    await prisma.order.create({
      data: { accountId: ACCOUNT_ID, status: OrderStatus.APPROVED, amountNet: v, occurredAt: stamp(i) }
    });
  }
  for (const [i, v] of pendingList.entries()) {
    await prisma.order.create({
      data: { accountId: ACCOUNT_ID, status: OrderStatus.PENDING, amountNet: v, occurredAt: stamp(approvedList.length + i) }
    });
  }
  for (const [i, v] of refundedList.entries()) {
    await prisma.order.create({
      data: { accountId: ACCOUNT_ID, status: OrderStatus.REFUNDED, amountNet: v, occurredAt: stamp(approvedList.length + pendingList.length + i) }
    });
  }

  // ---------- ADSPEND ----------
  // baseline total = 155 (antes), multiplicado por ADS_M
  const adsTotal = ADS_TOTAL != null ? ADS_TOTAL : round2(155 * ADS_M);
  const adsCount = ADS_COUNT != null ? Math.max(1, ADS_COUNT) : 1;
  const adsParts = splitInChunks(adsTotal, adsCount);
  for (const [i, amt] of adsParts.entries()) {
    await prisma.adspend.create({
      data: { accountId: ACCOUNT_ID, date: stamp(i), amount: amt }
    });
  }

  // ---------- EXPENSES ----------
  // baseline total = 65, multiplicado por EXP_M
  const expTotal = EXP_TOTAL != null ? EXP_TOTAL : round2(65 * EXP_M);
  const expCount = EXP_COUNT != null ? Math.max(1, EXP_COUNT) : 1;
  const expParts = splitInChunks(expTotal, expCount);
  for (const [i, amt] of expParts.entries()) {
    await prisma.expense.create({
      data: { accountId: ACCOUNT_ID, date: stamp(i), amount: amt, note: 'Operacional' }
    });
  }

  // ---------- resumo de saída ----------
  const toMoney = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const sum = (a) => a.reduce((x, y) => x + y, 0);

  console.log(
    `Seed OK ${APPEND ? '(append)' : '(idempotente)'} para o dia com offset=${OFFSET}.`
  );
  console.log(
    `Orders => approved:${approvedList.length} pending:${pendingList.length} refunded:${refundedList.length} (total líquido: ${toMoney(round2(sum(approvedList) + sum(pendingList) + sum(refundedList)))})`
  );
  console.log(
    `Adspend => lançamentos:${adsParts.length} total:${toMoney(adsTotal)} | Expenses => lançamentos:${expParts.length} total:${toMoney(expTotal)}`
  );
  console.log(
    `Multiplicadores => sales:${SALES_M} ads:${ADS_M} exp:${EXP_M} | account=${ACCOUNT_ID}`
  );
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
