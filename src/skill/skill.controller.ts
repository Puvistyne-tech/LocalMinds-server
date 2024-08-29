import {Body, Controller, Delete, Get, Param, Post, Put, Query,} from '@nestjs/common';
import {SkillsService} from './skill.service';
import {Skill} from './entities/skill.entity';
import {SkillItem} from './entities/skillTtem.entity';
import {CreateSkillDto} from './dto/create-skill.dto';
import {CreateSkillItemDto} from './dto/create-skill-item.dto';
import {UpdateSkillItemDto} from './dto/update-skill-item.dto';

@Controller('skills')
export class SkillsController {
    constructor(private readonly skillsService: SkillsService) {
    }

    @Get('test')
    testEndpoint(): string {
        return 'Test endpoint is working';
    }

    @Get('demo')
    async createDemoSkill(): Promise<Skill> {
        return this.skillsService.createDemo();
    }

    @Get()
    async findAll(): Promise<Skill[]> {
        return this.skillsService.findAll();
    }

    @Get('search')
    async findSkillsByCriteria(
        @Query('name') name?: string,
        @Query('tags') tags?: string[],
        @Query('category') category?: string,
    ): Promise<Skill[]> {
        return this.skillsService.findSkillsByCriteria({name, tags, category});
    }

    @Get(':id')
    async findSkillById(@Param('id') id: string): Promise<Skill> {
        return this.skillsService.findSkillById(id);
    }

    @Get('items/type/:type')
    async findSkillItemsByType(
        @Param('type') type: string,
    ): Promise<SkillItem[]> {
        return this.skillsService.findSkillItemsByType(type);
    }

    @Get(':skillId/items')
    async findSkillItemsBySkillId(
        @Param('skillId') skillId: string,
    ): Promise<SkillItem[]> {
        return this.skillsService.findSkillItemsBySkillId(skillId);
    }

    // Create a new skill
    @Post()
    async createSkill(@Body() createSkillDto: CreateSkillDto): Promise<Skill> {
        return this.skillsService.create(createSkillDto);
    }

    // Update an existing skill by ID
    @Put(':id')
    async updateSkill(
        @Param('id') id: string,
        @Body() updateSkillDto: Partial<Skill>,
    ): Promise<Skill> {
        return this.skillsService.update(id, updateSkillDto);
    }

    // Delete a skill by ID
    @Delete(':id')
    async deleteSkill(@Param('id') id: string): Promise<void> {
        return this.skillsService.delete(id);
    }

    // Create a new skill item
    @Post('items')
    async createSkillItem(
        @Body() createSkillItemDto: CreateSkillItemDto,
    ): Promise<SkillItem> {
        return this.skillsService.createSkillItem(createSkillItemDto);
    }

    // Update a skill item by ID
    @Put('items/:id')
    async updateSkillItem(
        @Param('id') id: string,
        @Body() updateSkillItemDto: UpdateSkillItemDto,
    ): Promise<Skill> {
        return this.skillsService.update(id, updateSkillItemDto);
    }

    // Delete a skill item by ID
    @Delete('items/:id')
    async deleteSkillItem(@Param('id') id: string): Promise<void> {
        return this.skillsService.delete(id);
    }
}
