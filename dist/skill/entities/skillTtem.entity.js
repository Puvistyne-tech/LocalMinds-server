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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextSchema = exports.LinkSchema = exports.SkillItemSchema = exports.Link = exports.Text = exports.SkillItem = exports.SkillItemType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var SkillItemType;
(function (SkillItemType) {
    SkillItemType["TEXT"] = "Text";
    SkillItemType["LINK"] = "Link";
    SkillItemType["PHOTO"] = "Photo";
    SkillItemType["WORK"] = "Work";
})(SkillItemType || (exports.SkillItemType = SkillItemType = {}));
let SkillItem = class SkillItem extends mongoose_2.Document {
};
exports.SkillItem = SkillItem;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SkillItem.prototype, "order", void 0);
exports.SkillItem = SkillItem = __decorate([
    (0, mongoose_1.Schema)({ discriminatorKey: 'type' })
], SkillItem);
let Text = class Text extends SkillItem {
};
exports.Text = Text;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Text.prototype, "text", void 0);
exports.Text = Text = __decorate([
    (0, mongoose_1.Schema)()
], Text);
let Link = class Link extends SkillItem {
};
exports.Link = Link;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Link.prototype, "link", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Link.prototype, "description", void 0);
exports.Link = Link = __decorate([
    (0, mongoose_1.Schema)()
], Link);
exports.SkillItemSchema = mongoose_1.SchemaFactory.createForClass(SkillItem);
exports.LinkSchema = exports.SkillItemSchema.discriminator(SkillItemType.LINK, mongoose_1.SchemaFactory.createForClass(Link));
exports.TextSchema = exports.SkillItemSchema.discriminator(SkillItemType.TEXT, mongoose_1.SchemaFactory.createForClass(Text));
//# sourceMappingURL=skillTtem.entity.js.map