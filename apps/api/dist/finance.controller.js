"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
function start(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function end(d) { const s = start(d); return new Date(s.getFullYear(), s.getMonth(), s.getDate() + 1); }
let FinanceController = class FinanceController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async adspend(accountId, dateStr) {
        const base = dateStr ? new Date(dateStr + 'T00:00:00') : new Date();
        const gte = start(base), lt = end(base);
        return this.prisma.adspend.findMany({
            where: { ...(accountId ? { accountId } : {}), date: { gte, lt } },
            include: { account: { select: { id: true, platform: true } } },
            orderBy: { date: 'desc' },
        });
    }
    async expenses(accountId, dateStr) {
        const base = dateStr ? new Date(dateStr + 'T00:00:00') : new Date();
        const gte = start(base), lt = end(base);
        return this.prisma.expense.findMany({
            where: { ...(accountId ? { accountId } : {}), date: { gte, lt } },
            include: { account: { select: { id: true, platform: true } } },
            orderBy: { date: 'desc' },
        });
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)('adspend'),
    __param(0, (0, common_1.Query)('accountId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "adspend", null);
__decorate([
    (0, common_1.Get)('expenses'),
    __param(0, (0, common_1.Query)('accountId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "expenses", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map