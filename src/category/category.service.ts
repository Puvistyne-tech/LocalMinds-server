import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category } from "./entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {

  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>
  ) {}

  // Create or update a category
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, subcategories } = createCategoryDto;

    // Check if a category with the same name already exists
    let category = await this.categoryModel.findOne({ name }).exec();

    if (category) {
      // Update existing category with new subcategories
      category.subcategories = subcategories;
      return await category.save();
      // if (subcategories && subcategories.length > 0) {
      //     await this.addSubcategories(category, subcategories);
      // }
      // return this.populateSubcategories(category);
    }

    // Category does not exist, create it
    category = new this.categoryModel(createCategoryDto);

    // if (subcategories && subcategories.length > 0) {
    //     await this.addSubcategories(category, subcategories);
    // }

    return await category.save();
    // return this.populateSubcategories(category);
  }

  // Add subcategories to a category
  // private async addSubcategories(category: CategoryDocument, subcategoryNames: string[]): Promise<void> {
  //     for (const subcategoryName of subcategoryNames) {
  //         let subcategory = await this.categoryModel.findOne({name: subcategoryName}).exec();
  //         if (!subcategory) {
  //             // Create new subcategory if it doesn't exist
  //             subcategory = new this.categoryModel({name: subcategoryName});
  //             await subcategory.save();
  //         }
  //
  //         // Avoid duplicate subcategory entries
  //         if (!category.subcategories.includes(subcategory.id)) {
  //             category.subcategories.push(subcategory.id);
  //         }
  //
  //         // Recursively add subcategories to the new subcategory
  //         await this.addSubcategories(subcategory, []); // Assuming you want to handle recursive subcategories later
  //     }
  //     await category.save();
  // }

  // Populate subcategories recursively
  // private async populateSubcategories(category: CategoryDocument, visitedIds: Set<string> = new Set()): Promise<CategoryDocument> {
  //     if (visitedIds.has(category.id)) {
  //         return category.toObject(); // Avoid processing the same category multiple times
  //     }
  //
  //     visitedIds.add(category.id);
  //     const populatedCategory = category.toObject();
  //
  //     if (populatedCategory.subcategories && populatedCategory.subcategories.length > 0) {
  //         const subcategories = await this.categoryModel.find({_id: {$in: populatedCategory.subcategories}}).exec();
  //         populatedCategory.subcategories = await Promise.all(
  //             subcategories.map(async (sub) => this.populateSubcategories(sub, visitedIds))
  //         );
  //     }
  //
  //     return populatedCategory;
  // }

  // Find a category by ID
  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
    // return this.populateSubcategories(category);
  }

  // Find all top-level categories
  // async findAllTopLevel(): Promise<Category[]> {
  //     const topLevelCategories = await this.categoryModel.find({subcategories: {$exists: true, $ne: []}}).exec();
  //     return Promise.all(topLevelCategories.map(category => this.populateSubcategories(category)));
  // }

  // Find all categories
  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.find().exec();
    return categories;
    // return Promise.all(categories.map(category => this.populateSubcategories(category)));
  }

  async findByName(name: string): Promise<Category> {
    const category = await this.categoryModel.findOne({name}).exec();
    return category;
  }

  // Delete a category by ID
  async remove(id: string): Promise<void> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.categoryModel.findByIdAndDelete(id).exec();
  }

  async createMany(
    createCategoryDtos: CreateCategoryDto[]
  ): Promise<Category[]> {
    const createdCategories: Category[] = []; // To store created/updated categories

    // Utilize bulkWrite for efficiency
    const bulkOps = createCategoryDtos.map((dto) => {
      const { name, subcategories } = dto;
      return {
        updateOne: {
          filter: { name }, // Find by name
          update: { $set: { subcategories } }, // Update subcategories
          upsert: true, // Create if not exists
        },
      };
    });

    const writeResult = await this.categoryModel.bulkWrite(bulkOps);

    // After bulkWrite, fetch the updated/created categories
    const updatedCategoryNames = createCategoryDtos.map((dto) => dto.name);
    createdCategories.push(
      ...(await this.categoryModel
        .find({ name: { $in: updatedCategoryNames } })
        .exec())
    );


    return createdCategories;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
  }
}
