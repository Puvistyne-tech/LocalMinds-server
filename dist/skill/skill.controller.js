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
exports.SkillsController = void 0;
const common_1 = require("@nestjs/common");
const skill_service_1 = require("./skill.service");
const create_skill_dto_1 = require("./dto/create-skill.dto");
const create_skill_item_dto_1 = require("./dto/create-skill-item.dto");
const update_skill_item_dto_1 = require("./dto/update-skill-item.dto");
let SkillsController = class SkillsController {
    constructor(skillsService) {
        this.skillsService = skillsService;
    }
    testEndpoint() {
        return 'Test endpoint is working';
    }
    async createDemoSkill() {
        return this.skillsService.createDemo();
    }
    async findAll() {
        return this.skillsService.findAll();
    }
    async findSkillsByCriteria(name, tags, category) {
        return this.skillsService.findSkillsByCriteria({ name, tags, category });
    }
    async findSkillById(id) {
        return this.skillsService.findSkillById(id);
    }
    async findSkillItemsByType(type) {
        return this.skillsService.findSkillItemsByType(type);
    }
    async findSkillItemsBySkillId(skillId) {
        return this.skillsService.findSkillItemsBySkillId(skillId);
    }
    async createSkill(createSkillDto) {
        return this.skillsService.create(createSkillDto);
    }
    async updateSkill(id, updateSkillDto) {
        return this.skillsService.update(id, updateSkillDto);
    }
    async deleteSkill(id) {
        return this.skillsService.delete(id);
    }
    async createSkillItem(createSkillItemDto) {
        return this.skillsService.createSkillItem(createSkillItemDto);
    }
    async updateSkillItem(id, updateSkillItemDto) {
        return this.skillsService.update(id, updateSkillItemDto);
    }
    async deleteSkillItem(id) {
        return this.skillsService.delete(id);
    }
};
exports.SkillsController = SkillsController;
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], SkillsController.prototype, "testEndpoint", null);
__decorate([
    (0, common_1.Get)('demo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "createDemoSkill", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('name')),
    __param(1, (0, common_1.Query)('tags')),
    __param(2, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, String]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "findSkillsByCriteria", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "findSkillById", null);
__decorate([
    (0, common_1.Get)('items/type/:type'),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "findSkillItemsByType", null);
__decorate([
    (0, common_1.Get)(':skillId/items'),
    __param(0, (0, common_1.Param)('skillId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "findSkillItemsBySkillId", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_skill_dto_1.CreateSkillDto]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "createSkill", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "updateSkill", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "deleteSkill", null);
__decorate([
    (0, common_1.Post)('items'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_skill_item_dto_1.CreateSkillItemDto]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "createSkillItem", null);
__decorate([
    (0, common_1.Put)('items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_skill_item_dto_1.UpdateSkillItemDto]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "updateSkillItem", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "deleteSkillItem", null);
exports.SkillsController = SkillsController = __decorate([
    (0, common_1.Controller)('skills'),
    __metadata("design:paramtypes", [skill_service_1.SkillsService])
], SkillsController);
//# sourceMappingURL=skill.controller.js.map