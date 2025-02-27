import {PostType} from "./entities/post.entity";

enum Order {
    ASCENDING = "ASCENDING",
    DESCENDING = "DESCENDING",
}

export class PostFilter {
    query?: string;
    tags?: string;
    category?: string;
    subcategory?: string;
    type?: PostType;
    date?: string;
    location?: string;
    page?: number;
    pageSize?: number;
    order?: string;
}