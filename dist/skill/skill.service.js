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
exports.SkillsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const skill_entity_1 = require("./entities/skill.entity");
const skillTtem_entity_1 = require("./entities/skillTtem.entity");
const work_document_1 = require("./entities/work.document");
const photo_document_1 = require("./entities/photo.document");
const category_entity_1 = require("../category/entities/category.entity");
let SkillsService = class SkillsService {
    constructor(skillModel, photoModel, linkModel, workModel, textModel, categoryModel) {
        this.skillModel = skillModel;
        this.photoModel = photoModel;
        this.linkModel = linkModel;
        this.workModel = workModel;
        this.textModel = textModel;
        this.categoryModel = categoryModel;
    }
    async create(createSkillDto) {
        const skill_items = await Promise.all(createSkillDto.skill_items.map(async (item) => {
            return this.createSkillItem(item);
        }));
        const category = await this.categoryModel.findById(createSkillDto.category).exec();
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${createSkillDto.category} not found`);
        }
        const createdSkill = new this.skillModel({
            name: createSkillDto.name,
            description: createSkillDto.description,
            date_created: new Date(),
            date_modified: new Date(),
            tags: createSkillDto.tags,
            category: createSkillDto.category,
            skill_items: skill_items,
        });
        return createdSkill.save();
    }
    async findSkillById(id) {
        const skill = await this.skillModel
            .findById(id)
            .populate('skill_items')
            .exec();
        if (!skill) {
            throw new common_1.NotFoundException(`Skill with ID ${id} not found`);
        }
        return skill;
    }
    async findAll() {
        return this.skillModel.find().exec();
    }
    async findAllSkills() {
        return this.skillModel.find().populate('skill_items').exec();
    }
    async findSkillsByCriteria(criteria) {
        const exactQuery = {};
        const partialQuery = {};
        if (criteria.name) {
            exactQuery.name = criteria.name;
            partialQuery.name = { $regex: criteria.name, $options: 'i' };
        }
        if (criteria.tags) {
            const tagsArray = Array.isArray(criteria.tags)
                ? criteria.tags
                : [criteria.tags];
            exactQuery.tags = { $all: tagsArray };
            const tagRegexes = tagsArray.map((tag) => new RegExp(tag, 'i'));
            partialQuery.tags = { $all: tagRegexes };
        }
        if (criteria.category) {
            const category = await this.categoryModel.findById(criteria.category).exec();
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${criteria.category} not found`);
            }
            exactQuery.category = criteria.category;
            partialQuery.category = criteria.category;
        }
        const exactMatches = await this.skillModel
            .find(exactQuery)
            .populate('skill_items')
            .exec();
        const partialMatches = await this.skillModel
            .find(partialQuery)
            .populate('skill_items')
            .exec();
        return exactMatches.concat(partialMatches.filter((partialItem) => !exactMatches.some((exactItem) => exactItem._id.equals(partialItem._id))));
    }
    getSkillItemModel(type) {
        type = type.toLowerCase();
        switch (type) {
            case skillTtem_entity_1.SkillItemType.TEXT.toLowerCase():
                return this.textModel;
            case skillTtem_entity_1.SkillItemType.PHOTO.toLowerCase():
                return this.photoModel;
            case skillTtem_entity_1.SkillItemType.LINK.toLowerCase():
                return this.linkModel;
            case skillTtem_entity_1.SkillItemType.WORK.toLowerCase():
                return this.workModel;
            default:
                throw new common_1.NotFoundException(`Unknown SkillItem type: ${type}`);
        }
    }
    async findSkillItemsBySkillId(skillId) {
        const skill = await this.skillModel
            .findById(skillId)
            .populate('skill_items')
            .exec();
        if (!skill) {
            throw new Error(`Skill with ID ${skillId} not found`);
        }
        return skill.skill_items;
    }
    async findSkillItemsByType(type) {
        type = type.toLowerCase();
        if (!Object.values(skillTtem_entity_1.SkillItemType)
            .map((t) => t.toLowerCase())
            .includes(type)) {
            throw new common_1.NotFoundException(`SkillItem type ${type} not found`);
        }
        const model = this.getSkillItemModel(type);
        return model.find().exec();
    }
    async createDemo() {
        const demoText = new this.textModel({
            order: 1,
            text: 'This is a sample text item.',
            type: 'Text',
        });
        const demoLink = new this.linkModel({
            order: 2,
            link: 'https://example.com',
            description: 'This is a sample link item.',
        });
        const demoPhoto = new this.photoModel({
            order: 3,
            content: 'photo1.jpg',
            name: 'First Photo',
            type: 'Photo',
        });
        const demoWork = new this.workModel({
            order: 4,
            name: 'Project XYZ',
            description: 'A detailed project description.',
            location: 'New York, NY',
            time_slots: ['9:00 AM - 11:00 AM', '1:00 PM - 3:00 PM'],
        });
        const skill_items = [demoText, demoLink, demoPhoto, demoWork];
        const demoSkill = new this.skillModel({
            name: 'Sample Skill',
            description: 'This is a sample skill description.',
            date_created: new Date(),
            date_modified: new Date(),
            tags: ['Sample Skill'],
            category: 'Sample Skill',
            skill_items: skill_items,
        });
        return this.createSkill(demoSkill);
    }
    async createSkill(skill) {
        const createdSkill = new this.skillModel(skill);
        return createdSkill.save();
    }
    async update(id, updateSkillDto) {
        const existingSkill = await this.skillModel.findById(id).exec();
        if (!existingSkill) {
            throw new Error(`Skill with ID ${id} not found`);
        }
        if (updateSkillDto.name)
            existingSkill.name = updateSkillDto.name;
        if (updateSkillDto.description)
            existingSkill.description = updateSkillDto.description;
        if (updateSkillDto.tags)
            existingSkill.tags = updateSkillDto.tags;
        if (updateSkillDto.category) {
            const category = await this.categoryModel.findById(updateSkillDto.category).exec();
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${updateSkillDto.category} not found`);
            }
            existingSkill.category = updateSkillDto.category;
        }
        if (updateSkillDto.skill_items) {
            existingSkill.skill_items = await Promise.all(updateSkillDto.skill_items.map(async (item) => {
                return this.createSkillItem(item);
            }));
        }
        existingSkill.date_modified = new Date();
        return existingSkill.save();
    }
    async delete(id) {
        const result = await this.skillModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new Error(`Skill with ID ${id} not found`);
        }
        await Promise.all(result.skill_items.map(async (item) => {
            switch (item.type) {
                case 'Text':
                    return this.textModel.findByIdAndDelete(item._id).exec();
                case 'Link':
                    return this.linkModel.findByIdAndDelete(item._id).exec();
                case 'Photo':
                    return this.photoModel.findByIdAndDelete(item._id).exec();
                case 'Work':
                    return this.workModel.findByIdAndDelete(item._id).exec();
            }
        }));
    }
    createSkillItem(createSkillItemDto) {
        switch (createSkillItemDto.type) {
            case skillTtem_entity_1.SkillItemType.TEXT:
                return new this.textModel({
                    order: createSkillItemDto.order,
                    text: createSkillItemDto.content,
                }).save();
            case skillTtem_entity_1.SkillItemType.LINK:
                return new this.linkModel({
                    order: createSkillItemDto.order,
                    link: createSkillItemDto.link,
                    description: createSkillItemDto.description,
                }).save();
            case skillTtem_entity_1.SkillItemType.PHOTO:
                return new this.photoModel({
                    order: createSkillItemDto.order,
                    content: createSkillItemDto.content,
                    name: createSkillItemDto.name,
                    type: createSkillItemDto.type,
                }).save();
            case skillTtem_entity_1.SkillItemType.WORK:
                return new this.workModel({
                    order: createSkillItemDto.order,
                    name: createSkillItemDto.name,
                    description: createSkillItemDto.description,
                    location: createSkillItemDto.location,
                    time_slots: createSkillItemDto.time_slots,
                }).save();
            default:
                throw new Error(`Unknown SkillItem type: ${skillTtem_entity_1.SkillItemType}`);
        }
    }
};
exports.SkillsService = SkillsService;
exports.SkillsService = SkillsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(skill_entity_1.Skill.name)),
    __param(1, (0, mongoose_1.InjectModel)(photo_document_1.Photo.name)),
    __param(2, (0, mongoose_1.InjectModel)(skillTtem_entity_1.Link.name)),
    __param(3, (0, mongoose_1.InjectModel)(work_document_1.Work.name)),
    __param(4, (0, mongoose_1.InjectModel)(skillTtem_entity_1.Text.name)),
    __param(5, (0, mongoose_1.InjectModel)(category_entity_1.Category.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SkillsService);
//# sourceMappingURL=skill.service.js.map