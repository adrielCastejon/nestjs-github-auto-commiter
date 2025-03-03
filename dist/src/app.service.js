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
var AppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const child_process_1 = require("child_process");
const date_fns_1 = require("date-fns");
const fs_1 = require("fs");
let AppService = AppService_1 = class AppService {
    logger = new common_1.Logger(AppService_1.name);
    commitMessages;
    targetFile = 'commits.log';
    constructor() {
        this.commitMessages = (0, fs_1.readFileSync)('commit-messages.txt', 'utf8')
            .split('\n')
            .filter((msg) => msg.trim().length > 0);
    }
    handleCommits() {
        const commitCount = this.calculateCommitCount();
        this.logger.log(`Today's commit count: ${commitCount}`);
        this.executeCommits(commitCount);
        this.pushChanges();
    }
    calculateCommitCount() {
        const rand = Math.random();
        if (rand < 0.5)
            return 1;
        if (rand < 0.75)
            return 2;
        if (rand < 0.875)
            return 3;
        return 4 + Math.floor(Math.random() * 3);
    }
    executeCommits(commitCount) {
        for (let i = 0; i < commitCount; i++) {
            try {
                (0, fs_1.appendFileSync)(this.targetFile, `${(0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss')} - Commit ${i + 1}\n`);
                (0, child_process_1.execSync)('git add .');
                const message = this.commitMessages[Math.floor(Math.random() * this.commitMessages.length)];
                (0, child_process_1.execSync)(`git commit -m "${message}" --allow-empty`);
                this.logger.debug(`Commit ${i + 1} realizado: ${message}`);
            }
            catch (error) {
                this.logger.error(`Falha no commit ${i + 1}: ${error.message}`);
            }
        }
    }
    pushChanges() {
        try {
            (0, child_process_1.execSync)('git push origin main');
            this.logger.log('Push realizado com sucesso');
        }
        catch (error) {
            this.logger.error(`Erro no push: ${error.message}`);
        }
    }
};
exports.AppService = AppService;
__decorate([
    (0, schedule_1.Cron)('0 0 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppService.prototype, "handleCommits", null);
exports.AppService = AppService = AppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
//# sourceMappingURL=app.service.js.map