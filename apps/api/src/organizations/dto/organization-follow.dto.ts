import { ApiProperty } from '@nestjs/swagger';

export class OrganizationFollowDto {
  @ApiProperty({
    description: 'Organization ID',
  })
  id: string;

  @ApiProperty({
    description: 'Organization name',
  })
  name: string;

  @ApiProperty({
    description: 'Organization description',
  })
  description: string;

  @ApiProperty({
    description: 'Organization website',
    required: false,
  })
  website?: string;

  @ApiProperty({
    description: 'Organization logo URL',
    required: false,
  })
  logoUrl?: string;

  @ApiProperty({
    description: 'Primary brand color',
    required: false,
  })
  primaryColor?: string;

  @ApiProperty({
    description: 'Secondary brand color',
    required: false,
  })
  secondaryColor?: string;

  @ApiProperty({
    description: 'When the user started following this organization',
  })
  followedAt: Date;

  @ApiProperty({
    description: 'Number of feed items from this organization',
  })
  feedItemCount: number;

  @ApiProperty({
    description: 'Number of available titles from this organization',
  })
  titleCount: number;
}
