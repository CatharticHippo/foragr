import {
  Controller,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { ProfileStatusDto, ProfileProgressDto } from './dto/profile-status.dto';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user status and progress information' })
  @ApiResponse({
    status: 200,
    description: 'User status and progress data',
    type: ProfileProgressDto,
  })
  async getProfileStatus(@Request() req: any): Promise<ProfileProgressDto> {
    const userId = req.user.id;
    return this.profileService.getProfileProgress(userId);
  }
}
