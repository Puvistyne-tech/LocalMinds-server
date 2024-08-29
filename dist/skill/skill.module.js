"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const skill_service_1 = require("./skill.service");
const skill_entity_1 = require("./entities/skill.entity");
const work_document_1 = require("./entities/work.document");
const skillTtem_entity_1 = require("./entities/skillTtem.entity");
const photo_document_1 = require("./entities/photo.document");
const category_module_1 = require("../category/category.module");
const skill_controller_1 = require("./skill.controller");
let SkillsModule = class SkillsModule {
};
exports.SkillsModule = SkillsModule;
exports.SkillsModule = SkillsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: skill_entity_1.Skill.name, schema: skill_entity_1.SkillSchema },
                { name: photo_document_1.Photo.name, schema: photo_document_1.PhotoSchema },
                { name: skillTtem_entity_1.Link.name, schema: skillTtem_entity_1.LinkSchema },
                { name: work_document_1.Work.name, schema: work_document_1.WorkSchema },
                { name: skillTtem_entity_1.Text.name, schema: skillTtem_entity_1.TextSchema },
            ]),
            category_module_1.CategoryModule,
        ],
        providers: [skill_service_1.SkillsService],
        exports: [skill_service_1.SkillsService],
        controllers: [skill_controller_1.SkillsController]
    })
], SkillsModule);
//# sourceMappingURL=skill.module.js.map