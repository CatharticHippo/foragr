import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganizationsService } from './organizations.service';
import { FollowOrganizationDto, FollowOrganizationResponseDto } from './dto/follow-organization.dto';
import { OrganizationFollowDto } from './dto/organization-follow.dto';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all approved organizations' })
  @ApiResponse({
    status: 200,
    description: 'List of approved organizations',
  })
  async findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiResponse({
    status: 200,
    description: 'Organization details',
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Follow or unfollow an organization' })
  @ApiResponse({
    status: 200,
    description: 'Follow/unfollow action completed',
    type: FollowOrganizationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async followOrganization(
    @Param('id') orgId: string,
    @Body() followDto: FollowOrganizationDto,
    @Request() req: any,
  ): Promise<FollowOrganizationResponseDto> {
    const userId = req.user.id;
    return this.organizationsService.followOrganization(userId, orgId, followDto.follow);
  }

  @Get('following')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organizations the user is following' })
  @ApiResponse({
    status: 200,
    description: 'List of followed organizations',
    type: [OrganizationFollowDto],
  })
  async getFollowing(@Request() req: any): Promise<OrganizationFollowDto[]> {
    const userId = req.user.id;
    return this.organizationsService.getFollowing(userId);
  }
}
