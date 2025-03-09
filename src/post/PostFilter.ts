import {PostType} from "./entities/post.entity";

enum Order {
    ASCENDING = "ASCENDING",
    DESCENDING = "DESCENDING",
}

export interface PostFilter {
    query?: string;
    tags?: string;
    category?: string;
    subcategory?: string;
    type?: PostType;
    date?: string;
    location?: {
        latitude: number;
        longitude: number;
        radius?: number; // in meters, optional
    };
    order?: string;
    page?: number;
    pageSize?: number;
}