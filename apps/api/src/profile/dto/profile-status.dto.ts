import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserStatus {
  MEMBER = 'MEMBER',
  VOLUNTEER = 'VOLUNTEER',
  DONOR = 'DONOR',
}

export class ProfileStatusDto {
  @ApiProperty({
    description: 'Current user status',
    enum: UserStatus,
  })
  status: UserStatus;

  @ApiProperty({
    description: 'Status color token for UI',
    example: '#10B981',
  })
  colorToken: string;

  @ApiProperty({
    description: 'Whether the status is verified',
  })
  verified: boolean;

  @ApiPropertyOptional({
    description: 'When the status was achieved',
  })
  since?: Date;

  @ApiProperty({
    description: 'Total XP points',
  })
  xp: number;

  @ApiProperty({
    description: 'Current level',
  })
  level: number;

  @ApiProperty({
    description: 'XP needed for next level',
  })
  nextLevelAt: number;

  @ApiProperty({
    description: 'XP progress to next level (0-100)',
  })
  progressPercentage: number;
}

export class UserOrgTitleDto {
  @ApiProperty({
    description: 'Title ID',
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
    description: 'Title code',
  })
  code: string;

  @ApiProperty({
    description: 'Title name',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Title description',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Border token for UI styling',
  })
  borderToken?: string;

  @ApiPropertyOptional({
    description: 'Icon token for UI styling',
  })
  iconToken?: string;

  @ApiProperty({
    description: 'When the title was awarded',
  })
  awardedAt: Date;

  @ApiProperty({
    description: 'XP reward for this title',
  })
  xpReward: number;
}

export class ProfileProgressDto {
  @ApiProperty({
    description: 'User status information',
    type: ProfileStatusDto,
  })
  status: ProfileStatusDto;

  @ApiProperty({
    description: 'Earned organization titles',
    type: [UserOrgTitleDto],
  })
  titles: UserOrgTitleDto[];

  @ApiProperty({
    description: 'Followed organizations count',
  })
  followedOrgsCount: number;
}
