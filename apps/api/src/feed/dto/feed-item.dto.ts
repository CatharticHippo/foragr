import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrgItemKind } from './feed-query.dto';

export class FeedItemDto {
  @ApiProperty({
    description: 'Feed item ID',
  })
  id: string;

  @ApiProperty({
    description: 'Organization ID',
  })
  orgId: string;

  @ApiProperty({
    description: 'Organization name',
  })
  orgName: string;

  @ApiProperty({
    description: 'Organization logo URL',
    required: false,
  })
  orgLogoUrl?: string;

  @ApiProperty({
    description: 'Organization primary color',
    required: false,
  })
  orgPrimaryColor?: string;

  @ApiProperty({
    description: 'Item kind',
    enum: OrgItemKind,
  })
  kind: OrgItemKind;

  @ApiProperty({
    description: 'Item title',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Item summary',
  })
  summary?: string;

  @ApiPropertyOptional({
    description: 'Item description',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Geographic location (longitude, latitude)',
    example: [-118.2437, 34.0522],
  })
  location?: [number, number];

  @ApiPropertyOptional({
    description: 'Start date/time',
  })
  startsAt?: Date;

  @ApiPropertyOptional({
    description: 'End date/time',
  })
  endsAt?: Date;

  @ApiPropertyOptional({
    description: 'External URL',
  })
  url?: string;

  @ApiPropertyOptional({
    description: 'Image URL',
  })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Additional structured data',
  })
  data?: Record<string, any>;

  @ApiProperty({
    description: 'Creation date',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
  })
  updatedAt: Date;
}

export class FeedResponseDto {
  @ApiProperty({
    description: 'Feed items',
    type: [FeedItemDto],
  })
  items: FeedItemDto[];

  @ApiProperty({
    description: 'Total count of items matching the query',
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
  })
  page: number;

  @ApiProperty({
    description: 'Items per page',
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there are more pages',
  })
  hasMore: boolean;
}
