import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FeedService } from './feed.service';
import { FeedQueryDto } from './dto/feed-query.dto';
import { FeedResponseDto } from './dto/feed-item.dto';

@ApiTags('feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('map')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get feed items for map view with optional clustering' })
  @ApiResponse({
    status: 200,
    description: 'Feed items for map display',
    type: FeedResponseDto,
  })
  async getMapFeed(
    @Query() query: FeedQueryDto,
    @Request() req: any,
  ): Promise<FeedResponseDto> {
    const userId = req.user.id;
    return this.feedService.getFeedItems(query, userId, true);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get feed items for list view with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Feed items for list display',
    type: FeedResponseDto,
  })
  async getListFeed(
    @Query() query: FeedQueryDto,
    @Request() req: any,
  ): Promise<FeedResponseDto> {
    const userId = req.user.id;
    return this.feedService.getFeedItems(query, userId, false);
  }
}
