import { IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FollowOrganizationDto {
  @ApiPropertyOptional({
    description: 'Whether to follow (true) or unfollow (false) the organization',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  follow?: boolean = true;
}

export class FollowOrganizationResponseDto {
  @ApiProperty({
    description: 'Whether the user is now following the organization',
  })
  following: boolean;

  @ApiProperty({
    description: 'Action taken (followed or unfollowed)',
    enum: ['followed', 'unfollowed'],
  })
  action: 'followed' | 'unfollowed';

  @ApiProperty({
    description: 'Organization ID',
  })
  orgId: string;

  @ApiProperty({
    description: 'User ID',
  })
  userId: string;
}
