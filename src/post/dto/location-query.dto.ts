import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class LocationQueryDto {
    @ApiProperty({ example: 48.8566, description: 'Latitude of the center point' })
    @IsNumber()
    @Min(-90)
    @Max(90)
    @Type(() => Number)
    latitude: number;

    @ApiProperty({ example: 2.3522, description: 'Longitude of the center point' })
    @IsNumber()
    @Min(-180)
    @Max(180)
    @Type(() => Number)
    longitude: number;

    @ApiProperty({ example: 5000, description: 'Search radius in meters', required: false })
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(50000) // Maximum 50km radius
    @Type(() => Number)
    radius?: number = 5000; // Default 5km radius
} 