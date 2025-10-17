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
exports.AccountsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let AccountsController = class AccountsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(q) {
        return this.prisma.account.findMany({
            where: q
                ? {
                    OR: [
                        { id: { contains: q } },
                        { platform: { contains: q } },
                        { user: { name: { contains: q } } },
                    ],
                }
                : undefined,
            include: { user: { select: { id: true, name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.AccountsController = AccountsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "list", null);
exports.AccountsController = AccountsController = __decorate([
    (0, common_1.Controller)('accounts'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccountsController);
//# sourceMappingURL=accounts.controller.js.map