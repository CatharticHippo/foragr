import { IsOptional, IsNumber, IsArray, IsEnum, IsString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export enum OrgItemKind {
  EVENT = 'EVENT',
  NEWS = 'NEWS',
  PROJECT = 'PROJECT',
}

export class FeedQueryDto {
  @ApiProperty({
    description: 'Minimum longitude (west boundary)',
    example: -118.5,
  })
  @IsNumber()
  @Type(() => Number)
  minLon: number;

  @ApiProperty({
    description: 'Minimum latitude (south boundary)',
    example: 34.0,
  })
  @IsNumber()
  @Type(() => Number)
  minLat: number;

  @ApiProperty({
    description: 'Maximum longitude (east boundary)',
    example: -118.2,
  })
  @IsNumber()
  @Type(() => Number)
  maxLon: number;

  @ApiProperty({
    description: 'Maximum latitude (north boundary)',
    example: 34.1,
  })
  @IsNumber()
  @Type(() => Number)
  maxLat: number;

  @ApiPropertyOptional({
    description: 'Filter by item kinds',
    enum: OrgItemKind,
    isArray: true,
    example: ['EVENT', 'NEWS'],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(OrgItemKind, { each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  kinds?: OrgItemKind[];

  @ApiPropertyOptional({
    description: 'Filter by organization IDs',
    type: [String],
    example: ['uuid1', 'uuid2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  orgIds?: string[];

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Enable clustering for map view',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  cluster?: boolean = false;
}
