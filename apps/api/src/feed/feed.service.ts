import { Injectable, Inject } from '@nestjs/common';
import { eq, and, sql, desc, asc, inArray, gte, lte, count } from 'drizzle-orm';
import { DrizzleDatabase } from '../database/database.types';
import { orgFeedItems, organizations, organizationFollows } from '../database/schema';
import { FeedQueryDto } from './dto/feed-query.dto';
import { FeedResponseDto, FeedItemDto } from './dto/feed-item.dto';

@Injectable()
export class FeedService {
  constructor(
    @Inject('DB_CONNECTION')
    private db: DrizzleDatabase,
  ) {}

  async getFeedItems(
    query: FeedQueryDto,
    userId: string,
    isMapView: boolean,
  ): Promise<FeedResponseDto> {
    const { minLon, minLat, maxLon, maxLat, kinds, orgIds, page = 1, limit = 20, cluster = false } = query;
    const offset = (page - 1) * limit;

    // Build base query with organization info
    let baseQuery = this.db
      .select({
        id: orgFeedItems.id,
        orgId: orgFeedItems.orgId,
        orgName: organizations.name,
        orgLogoUrl: organizations.logoUrl,
        orgPrimaryColor: organizations.primaryColor,
        kind: orgFeedItems.kind,
        title: orgFeedItems.title,
        summary: orgFeedItems.summary,
        description: orgFeedItems.description,
        location: orgFeedItems.location,
        startsAt: orgFeedItems.startsAt,
        endsAt: orgFeedItems.endsAt,
        url: orgFeedItems.url,
        imageUrl: orgFeedItems.imageUrl,
        data: orgFeedItems.data,
        createdAt: orgFeedItems.createdAt,
        updatedAt: orgFeedItems.updatedAt,
      })
      .from(orgFeedItems)
      .innerJoin(organizations, eq(orgFeedItems.orgId, organizations.id))
      .where(
        and(
          eq(orgFeedItems.isPublished, true),
          eq(organizations.status, 'approved'),
        ),
      );

    // Filter by followed organizations if no specific orgIds provided
    if (!orgIds || orgIds.length === 0) {
      const followedOrgs = await this.getFollowedOrganizationIds(userId);
      if (followedOrgs.length > 0) {
        baseQuery = baseQuery.where(
          and(
            eq(orgFeedItems.isPublished, true),
            eq(organizations.status, 'approved'),
            inArray(orgFeedItems.orgId, followedOrgs),
          ),
        );
      }
    } else {
      // Filter by specific organization IDs
      baseQuery = baseQuery.where(
        and(
          eq(orgFeedItems.isPublished, true),
          eq(organizations.status, 'approved'),
          inArray(orgFeedItems.orgId, orgIds),
        ),
      );
    }

    // Filter by item kinds
    if (kinds && kinds.length > 0) {
      baseQuery = baseQuery.where(
        and(
          eq(orgFeedItems.isPublished, true),
          eq(organizations.status, 'approved'),
          inArray(orgFeedItems.kind, kinds),
        ),
      );
    }

    // For map view, we might want to implement clustering logic here
    // For now, we'll just return the raw items
    if (isMapView && cluster) {
      // TODO: Implement clustering logic
      // This would involve grouping nearby items and returning cluster information
    }

    // Get total count for pagination
    const [totalResult] = await this.db
      .select({ count: count() })
      .from(orgFeedItems)
      .innerJoin(organizations, eq(orgFeedItems.orgId, organizations.id))
      .where(
        and(
          eq(orgFeedItems.isPublished, true),
          eq(organizations.status, 'approved'),
        ),
      );

    const total = totalResult.count;
    const totalPages = Math.ceil(total / limit);

    // Get paginated results
    const items = await baseQuery
      .orderBy(desc(orgFeedItems.createdAt))
      .limit(limit)
      .offset(offset);

    // Transform location data
    const transformedItems: FeedItemDto[] = items.map(item => ({
      ...item,
      location: item.location ? this.parseLocation(item.location) : undefined,
    }));

    return {
      items: transformedItems,
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
    };
  }

  private async getFollowedOrganizationIds(userId: string): Promise<string[]> {
    const follows = await this.db
      .select({ orgId: organizationFollows.orgId })
      .from(organizationFollows)
      .where(eq(organizationFollows.userId, userId));

    return follows.map(follow => follow.orgId);
  }

  private parseLocation(location: string): [number, number] | undefined {
    try {
      // Parse PostGIS geography format: "POINT(-118.2437 34.0522)"
      const match = location.match(/POINT\(([^)]+)\)/);
      if (match) {
        const [lon, lat] = match[1].split(' ').map(Number);
        return [lon, lat];
      }
      return undefined;
    } catch {
      return undefined;
    }
  }
}
