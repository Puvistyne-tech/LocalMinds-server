import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PaginateModel } from "mongoose";
import { Post, PostType } from "./entities/post.entity";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { UserService } from "../user/user.service";
import { EventEmitter } from "events";
import { ResponsePostDto } from "./dto/response-post.dto";
import { PostFilter } from "./PostFilter";
import { HydratedDocument } from "mongoose";
import { Category } from "src/category/entities/category.entity";
import { CategoryService } from "../category/category.service";

// import {EventEmitter2} from '@nestjs/event-emitter';

enum PostEventType {
  DELETE = "POST_DELETE",
  UPDATE = "POST_UPDATE",
  ADD = "POST_ADD",
}

@Injectable()
export class PostsService {
  readonly eventEmitter = new EventEmitter(); // Create an EventEmitter

  constructor(
    @InjectModel("Post") private readonly postModel: Model<Post>,
    @InjectModel("Post") private readonly postModelPag: PaginateModel<Post>,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService
    // private eventEmitter: EventEmitter2
  ) {}

  // Find all posts
  async findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  //get the postTypes
  async getAllPostTypes(): Promise<String[]> {
    return Object.values(PostType);
  }

  async advancedSearch(options: PostFilter): Promise<{
    posts: ResponsePostDto[];
    totalPages: number;
    nextPage: number | null; // Next page will be null if there is no next page
    previousPage: number | null; // Previous page will be null if it's the first page
    page: number;
    hasNextPage: boolean;
  }> {
    const query: any = {}; // Build the query object based on filter options

    console.log(options);

    // Use regex for case-insensitive search across multiple fields
    if (options.query) {
      query.$or = [
        { title: { $regex: options.query, $options: "i" } },
        { content: { $regex: options.query, $options: "i" } },
        { tags: { $regex: options.query, $options: "i" } },
      ];
    }

    // Handle the `tags` filtering
    if (options.tags) {
      const tagsArray = options.tags.split(",").map((tag) => tag.trim());
      query.tags = { $all: tagsArray };
    }

    if (options.category) {
      const subcategories = await this.categoryService.findByName(
        options.category
      );
      if (subcategories && subcategories.subcategories.length > 0) {
        // Include both the main category and its subcategories in the search
        query.category = {
          $in: [
            //options.category,
            ...subcategories.subcategories.map((sub) => sub),
          ],
        };
      } else {
        query.category = options.category;
      }
    }

    if (options.subcategory) {
      query.category = options.subcategory;
    }

    // Handle the `type` filtering with case-insensitivity
    if (options.type) {
      query.type = options.type;
    }

    if (options.date) {
      const dateRange = this.getDateRange(options.date);
      if (dateRange) {
        query.date_modified = { $gte: dateRange.start, $lte: dateRange.end };
      }
    }

    if (options.location) {
      query.location = { $regex: options.location, $options: "i" }; // Case-insensitive search
    }

    // Prepare sorting options
    const sortOptions: any = {};
    if (options.order === "ASCENDING") {
      sortOptions.date_modified = 1; // 1 for ascending
    } else if (options.order === "DESCENDING") {
      sortOptions.date_modified = -1; // -1 for descending
    } else {
      sortOptions.date_modified = -1; // Default to descending (new to old)
    }

    const paginationOptions: any = {
      page: options.page || 1, // Default to page 1 if not provided
      limit: options.pageSize || 10, // Default limit if not provided
      sort: sortOptions, // Add sorting options here
      populate: "user",
    };

    // Perform the pagination and fetch the results
    const result = await this.postModelPag.paginate(query, paginationOptions);

    // Prepare the response
    return {
      posts: ResponsePostDto.many(
        result.docs as Array<HydratedDocument<Post, {}, {}>>
      ),
      totalPages: result.totalPages,
      nextPage: result.nextPage, // If there's a next page, calculate it
      previousPage: result.prevPage, // If it's not the first page
      page: result.page, // Current page
      hasNextPage: result.hasNextPage, // Whether there is a next page
    };
  }

  private getDateRange(dateOption: string): { start: Date; end: Date } | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    switch (dateOption) {
      case "TODAY":
        return { start: today, end: today };
      case "YESTERDAY":
        start.setDate(today.getDate() - 1);
        return { start: start, end: today };
      case "THREE_DAYS":
        start.setDate(today.getDate() - 3);
        return { start: start, end: today };
      case "WEEK":
        start.setDate(today.getDate() - 7);
        return { start: start, end: today };
      case "MONTH":
        start.setMonth(today.getMonth() - 1);
        return { start: start, end: today };
      case "SIX_MONTHS":
        start.setMonth(today.getMonth() - 6);
        return { start: start, end: today };
      case "YEAR":
        start.setFullYear(today.getFullYear() - 1);
        return { start: start, end: today };
      default:
        // Handle invalid or unsupported date options
        return null;
    }
  }

  // async advancedSearch(
  //     options: SkillFilter
  // ): Promise<{ skills: ResponseSkillDto[]; totalPages: number }> {
  //     const query: any = {}; // Build the query object based on filter options
  //
  //     // Use regex for case-insensitive search across multiple fields
  //     if (options.query) {
  //         query.$or = [
  //             {title: {$regex: options.query, $options: "i"}},
  //             {content: {$regex: options.query, $options: "i"}},
  //         ];
  //     }
  //
  //     // Handle the `tags` filtering
  //     if (options.tags) {
  //         const tagsArray = options.tags.split(",").map((tag) => tag.trim());
  //         query.tags = {$all: tagsArray};
  //     }
  //
  //     if (options.category) {
  //         query.category = options.category;
  //     }
  //
  //     // Handle the `type` filtering with case-insensitivity
  //     if (options.type) {
  //         query.type = options.type;
  //     }
  //
  //     if (options.date) {
  //         const dateRange = this.getDateRange(options.date);
  //         if (dateRange) {
  //             query.date_modified = {$gte: dateRange.start, $lte: dateRange.end};
  //         }
  //     }
  //
  //     if (options.location) {
  //         query.location = {$regex: options.location, $options: "i"}; // Case-insensitive search
  //     }
  //
  //     if (options.page && options.pageSize) {
  //         // Perform pagination only if page and pageSize are provided
  //         const paginationOptions = {
  //             page: options.page,
  //             limit: options.pageSize,
  //             populate: "user",
  //         };
  //
  //         const result = await this.skillModelPag.paginate(
  //             query,
  //             paginationOptions
  //         );
  //         return {
  //             skills: ResponseSkillDto.many(result.docs),
  //             totalPages: result.totalPages,
  //         };
  //     } else {
  //         // If no pagination options, fetch all matching skills
  //         const skills = await this.skillModel.find(query).exec();
  //         const totalPages: number = 1; // Total count is the length of the fetched skills array
  //
  //         return {
  //             skills: ResponseSkillDto.many(skills),
  //             totalPages,
  //         };
  //     }
  // }
  //
  // private getDateRange(dateOption: string): { start: Date; end: Date } | null {
  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0); // Start of today
  //     const start = new Date();
  //     start.setHours(0, 0, 0, 0);
  //
  //     switch (dateOption) {
  //         case "TODAY":
  //             return {start: today, end: today};
  //         case "YESTERDAY":
  //             start.setDate(today.getDate() - 1);
  //             return {start: start, end: today};
  //         case "THREE_DAYS":
  //             start.setDate(today.getDate() - 3);
  //             return {start: start, end: today};
  //         case "WEEK":
  //             start.setDate(today.getDate() - 7);
  //             return {start: start, end: today};
  //         case "MONTH":
  //             start.setMonth(today.getMonth() - 1);
  //             return {start: start, end: today};
  //         case "SIX_MONTHS":
  //             start.setMonth(today.getMonth() - 6);
  //             return {start: start, end: today};
  //         case "YEAR":
  //             start.setFullYear(today.getFullYear() - 1);
  //             return {start: start, end: today};
  //         default:
  //             // Handle invalid or unsupported date options
  //             return null;
  //     }
  // }

  async getAllTags(): Promise<string[]> {
    const result = await this.postModel.aggregate([
      { $unwind: "$tags" }, // Deconstructs the tags array
      { $group: { _id: null, uniqueTags: { $addToSet: "$tags" } } }, // Collects unique tags
      { $project: { _id: 0, uniqueTags: 1 } }, // Project only the uniqueTags field
    ]);
    return result.length > 0 ? result[0].uniqueTags : [];
  }

  // Find a post by ID
  async findPostById(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  // Find post items by type
  async findPostsByType(type: PostType): Promise<Post[]> {
    return this.postModel.find({ type }).exec();
  }

  // Create a new post
  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const post = new this.postModel({
      ...createPostDto,
      user: userId,
    });

    return post.save();
  }

  // Update an existing post by ID
  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .populate("user")
      .exec();
    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Emit an event after updating a post
    this.eventEmitter.emit("postEvent", {
      type: PostEventType.UPDATE,
      data: updatedPost,
    });

    return updatedPost;
  }

  // Delete a post by ID
  async delete(id: string): Promise<void> {
    const result = await this.postModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    this.eventEmitter.emit("postEvent", {
      type: PostEventType.DELETE,
      data: result.id,
    });
  }

  async createPosts(createPostDtos: CreatePostDto[]): Promise<Post[]> {
    const posts: Post[] = []; // Initialize an empty array to store created posts

    for (const postDto of createPostDtos) {
      const newPost = new this.postModel(postDto);
      const savedPost = await newPost.save();
      posts.push(savedPost);
    }

    return posts;
  }

  // findAllStream(): Observable<Post[]> {
  //     // Fetch posts from the database (adjust as needed)
  //     const postsPromise = this.postModel.find().exec();
  //
  //     // Convert the Promise to an Observable
  //     return from(postsPromise);
  // }

  // Find posts with pagination
  // Find posts with pagination using mongoose-paginate-v2
  async findPaginated(
    page: number,
    pageSize: number
  ): Promise<{
    posts: ResponsePostDto[];
    totalPages: number;
    nextPage: number;
    previousPage: number;
    page: number;
    hasNextPage: boolean;
  }> {
    const options = {
      page,
      limit: pageSize,
      sort: { date_created: -1 }, // Sorting by date_created in descending order
      populate: "user", // Populating the user field
    };

    const result = await this.postModelPag.paginate({}, options);

    const postDtos = ResponsePostDto.many(result.docs);
    const pageCount = result.totalPages; // Total number of pages

    return {
      posts: postDtos,
      totalPages: result.totalPages,
      nextPage: result.nextPage,
      previousPage: result.prevPage,
      page: result.page,
      hasNextPage: result.hasNextPage,
    };
  }

  async searchTags(query: string): Promise<string[]> {
    const posts = await this.postModel
      .find({ tags: { $regex: query, $options: "i" } }) // Case-insensitive search
      .select("tags") // Only retrieve the tags field
      .exec();

    const tagsSet = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(query.toLowerCase())) {
          tagsSet.add(tag);
        }
      });
    });

    return Array.from(tagsSet); // Return unique tags as an array
  }

  getPostTypes() {
    return Object.values(PostType);
  }
}
