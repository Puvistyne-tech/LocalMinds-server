import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new category' })
    @ApiResponse({ status: 201, description: 'Category created successfully' })
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Post('many')
    @ApiOperation({ summary: 'Create multiple categories' })
    @ApiResponse({ status: 201, description: 'Categories created successfully' })
    createMany(@Body() createCategoryDtos: CreateCategoryDto[]) {
        return this.categoryService.createMany(createCategoryDtos);
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({ status: 200, description: 'Returns all categories' })
    findAll() {
        return this.categoryService.findAll();
    }

    @Get('subcategories')
    @ApiOperation({ summary: 'Get all subcategories' })
    @ApiResponse({ status: 200, description: 'Returns all subcategories' })
    findAllSubcategories(@Param('name') name: string) {
        return this.categoryService.findByName(name);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get category by ID' })
    @ApiResponse({ status: 200, description: 'Returns the category' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update category' })
    @ApiResponse({ status: 200, description: 'Category updated successfully' })
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete category' })
    @ApiResponse({ status: 200, description: 'Category deleted successfully' })
    remove(@Param('id') id: string) {
        return this.categoryService.remove(id);
    }
}
