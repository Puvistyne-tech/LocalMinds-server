import { SkillsService } from './skill.service';
import { Skill } from './entities/skill.entity';
import { SkillItem } from './entities/skillTtem.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { CreateSkillItemDto } from './dto/create-skill-item.dto';
import { UpdateSkillItemDto } from './dto/update-skill-item.dto';
export declare class SkillsController {
    private readonly skillsService;
    constructor(skillsService: SkillsService);
    createDemoSkill(): Promise<Skill>;
    findAll(): Promise<Skill[]>;
    findSkillsByCriteria(name?: string, tags?: string[], category?: string): Promise<Skill[]>;
    findSkillById(id: string): Promise<Skill>;
    findSkillItemsByType(type: string): Promise<SkillItem[]>;
    findSkillItemsBySkillId(skillId: string): Promise<SkillItem[]>;
    createSkill(createSkillDto: CreateSkillDto): Promise<Skill>;
    updateSkill(id: string, updateSkillDto: Partial<Skill>): Promise<Skill>;
    deleteSkill(id: string): Promise<void>;
    createSkillItem(createSkillItemDto: CreateSkillItemDto): Promise<SkillItem>;
    updateSkillItem(id: string, updateSkillItemDto: UpdateSkillItemDto): Promise<Skill>;
    deleteSkillItem(id: string): Promise<void>;
}
