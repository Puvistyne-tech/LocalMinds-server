import {
    Body,
    Controller,
    Delete,
    Get,
    MessageEvent,
    Param,
    Post,
    Put,
    Query,
    Sse,
    UseGuards,
    Request,
    Res,
} from "@nestjs/common";
import { PostsService } from "./post.service";
import { fromEvent, map, Observable } from "rxjs";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Public } from '../metadata';
import { HydratedDocument } from 'mongoose';
import { CreatePostDto } from "./dto/create-post.dto";
import { ResponsePostDto } from "./dto/response-post.dto";
import { PostType, Post as PostEntity } from "./entities/post.entity";
import { UpdatePostDto } from "./dto/update-post.dto";

@ApiTags('posts')
@Controller("posts")
export class PostsController {
    constructor(
        private readonly postsService: PostsService
    ) {}

    @Public()
    @Sse("stream")
    @ApiOperation({ 
        summary: 'Real-time post updates stream',
        description: `
Server-Sent Events endpoint for real-time post updates.
Emits events for the following actions:
- POST_ADD: When a new post is created
- POST_UPDATE: When a post is modified
- POST_DELETE: When a post is deleted

Each event contains:
- type: The type of action (ADD/UPDATE/DELETE)
- data: The post data or post ID (for DELETE)
        `
    })
    @ApiResponse({ 
        status: 200, 
        description: 'SSE Stream established',
        schema: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    enum: ['POST_ADD', 'POST_UPDATE', 'POST_DELETE'],
                    description: 'Type of post event'
                },
                data: {
                    oneOf: [
                        { $ref: '#/components/schemas/Res' },
                        { 
                            type: 'string',
                            description: 'Post ID (for DELETE events)'
                        }
                    ],
                    description: 'Event payload - full post object for ADD/UPDATE, post ID for DELETE'
                }
            },
            example: {
                type: 'POST_ADD',
                data: {
                    _id: '507f1f77bcf86cd799439011',
                    title: 'Web Development',
                    content: { text: 'Experienced in React and Node.js' },
                    tags: ['javascript', 'react'],
                    category: 'Programming',
                    type: 'OFFER',
                    status: false,
                    date_created: '2024-01-01T00:00:00.000Z',
                    date_modified: '2024-01-01T00:00:00.000Z',
                    user: {
                        _id: '507f1f77bcf86cd799439012',
                        username: 'johndoe',
                        email: 'john@example.com'
                    }
                }
            }
        }
    })
    postUpdates(): Observable<any> {
        const eventSource = fromEvent(
            this.postsService.eventEmitter,
            "postEvent"
        );
        return eventSource.pipe(
            map((event) => event as MessageEvent)
        );
    }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all posts with filters' })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns filtered posts with pagination',
        type: [ResponsePostDto] 
    })
    @ApiQuery({ name: 'query', required: false, description: 'Search query string' })
    @ApiQuery({ name: 'tags', required: false, description: 'Filter by tags' })
    @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
    @ApiQuery({ 
        name: 'type', 
        required: false, 
        enum: PostType,
        description: 'Filter by post type (OFFER or REQUEST)' 
    })
    @ApiQuery({ name: 'date', required: false, description: 'Filter by date' })
    @ApiQuery({ name: 'location', required: false, description: 'Filter by location' })
    @ApiQuery({ 
        name: 'order', 
        required: false, 
        description: 'Sort order (asc or desc)',
        enum: ['asc', 'desc'] 
    })
    @ApiQuery({ 
        name: 'page', 
        required: false, 
        description: 'Page number', 
        type: Number,
        example: 1 
    })
    @ApiQuery({ 
        name: 'pageSize', 
        required: false, 
        description: 'Number of items per page', 
        type: Number,
        example: 10 
    })
    async findPostsByCriteria(
        @Query("query") query?: string,
        @Query("tags") tags?: string,
        @Query("category") category?: string,
        @Query("subcategory") subcategory?: string,
        @Query("type") type?: PostType,
        @Query("date") date?: string,
        @Query("location") location?: string,
        @Query("order") order?: string,
        @Query("page") page: number = 1,
        @Query("pageSize") pageSize: number = 10
    ) {
        const result = await this.postsService.advancedSearch({
            query, tags, category,subcategory, type, page,
            pageSize, date, location, order,
        });
        console.log(result.posts);
        return result;
    }

    @Public()
    @Get("tags")
    async findAllPostTags(@Query("query") query?: string): Promise<String[]> {
        if (query) {
            return this.postsService.searchTags(query);
        }
        return this.postsService.getAllTags();
    }

    @Public()
    @Get("type")
    async findAllPostTypes(): Promise<String[]> {
        return this.postsService.getAllPostTypes();
    }

    @Public()
    @Get(":id")
    @ApiOperation({ summary: 'Get post by ID' })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns the post',
        type: ResponsePostDto 
    })
    async findPostById(@Param("id") id: string): Promise<PostEntity> {
        return this.postsService.findPostById(id);
    }

    @Public()
    @Get("items/type/:type")
    async findPostsByType(@Param("type") type: PostType): Promise<PostEntity[]> {
        return this.postsService.findPostsByType(type);
    }

    // Protected routes below
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Post()
    @ApiOperation({ summary: 'Create a new post' })
    @ApiResponse({ 
        status: 201, 
        description: 'Post created successfully',
        type: Res 
    })
    async createPost(
        @Body() createPostDto: CreatePostDto,
        @Request() req
    ): Promise<ResponsePostDto> {
        const post = await this.postsService.create(createPostDto, req.user.userId);
        
        // Emit event for real-time updates
        this.postsService.eventEmitter.emit("postEvent", {
            type: "POST_ADD",
            data: post
        });

        // Return the created post as Res
        return ResponsePostDto.from(post as HydratedDocument<PostEntity>);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Post("many")
    async createPosts(
        @Body() createPostDtos: CreatePostDto[]
    ): Promise<PostEntity[]> {
        return this.postsService.createPosts(createPostDtos);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Put(":id")
    @ApiOperation({ summary: 'Update post' })
    @ApiResponse({ 
        status: 200, 
        description: 'Post updated successfully',
        type: ResponsePostDto 
    })
    async updatePost(
        @Param("id") id: string,
        @Body() updatePostDto: UpdatePostDto
    ): Promise<PostEntity> {
        return this.postsService.update(id, updatePostDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Delete(":id")
    @ApiOperation({ summary: 'Delete post' })
    @ApiResponse({ status: 200, description: 'Post deleted successfully' })
    async deletePost(@Param("id") id: string): Promise<void> {
        return this.postsService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Delete("items/:id")
    async deletePostItem(@Param("id") id: string): Promise<void> {
        return this.postsService.delete(id);
    }
}
