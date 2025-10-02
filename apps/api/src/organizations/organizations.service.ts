import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { eq, and, count } from 'drizzle-orm';
import { DrizzleDatabase } from '../database/database.types';
import { organizations, organizationFollows, orgFeedItems, orgTitles } from '../database/schema';
import { FollowOrganizationResponseDto } from './dto/follow-organization.dto';
import { OrganizationFollowDto } from './dto/organization-follow.dto';
import { OutboxService } from '../common/services/outbox.service';

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject('DB_CONNECTION')
    private db: DrizzleDatabase,
    private outboxService: OutboxService,
  ) {}

  async findAll() {
    return this.db
      .select()
      .from(organizations)
      .where(eq(organizations.status, 'approved'))
      .orderBy(organizations.name);
  }

  async findOne(id: string) {
    const [organization] = await this.db
      .select()
      .from(organizations)
      .where(and(eq(organizations.id, id), eq(organizations.status, 'approved')));

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async followOrganization(
    userId: string,
    orgId: string,
    follow: boolean = true,
  ): Promise<FollowOrganizationResponseDto> {
    // Verify organization exists and is approved
    const organization = await this.findOne(orgId);

    // Check if user is already following
    const [existingFollow] = await this.db
      .select()
      .from(organizationFollows)
      .where(and(eq(organizationFollows.userId, userId), eq(organizationFollows.orgId, orgId)));

    let action: 'followed' | 'unfollowed';
    let following: boolean;

    if (follow && !existingFollow) {
      // Follow the organization
      await this.db.insert(organizationFollows).values({
        userId,
        orgId,
        createdAt: new Date(),
      });
      action = 'followed';
      following = true;

      // Emit outbox event
      await this.outboxService.createEvent({
        type: 'org.followed',
        aggregateId: orgId,
        aggregateType: 'organization',
        payload: {
          userId,
          orgId,
          organizationName: organization.name,
        },
      });
    } else if (!follow && existingFollow) {
      // Unfollow the organization
      await this.db
        .delete(organizationFollows)
        .where(and(eq(organizationFollows.userId, userId), eq(organizationFollows.orgId, orgId)));
      action = 'unfollowed';
      following = false;

      // Emit outbox event
      await this.outboxService.createEvent({
        type: 'org.unfollowed',
        aggregateId: orgId,
        aggregateType: 'organization',
        payload: {
          userId,
          orgId,
          organizationName: organization.name,
        },
      });
    } else {
      // No change needed
      action = existingFollow ? 'followed' : 'unfollowed';
      following = !!existingFollow;
    }

    return {
      following,
      action,
      orgId,
      userId,
    };
  }

  async getFollowing(userId: string): Promise<OrganizationFollowDto[]> {
    const follows = await this.db
      .select({
        id: organizations.id,
        name: organizations.name,
        description: organizations.description,
        website: organizations.websiteUrl,
        logoUrl: organizations.logoUrl,
        primaryColor: organizations.primaryColor,
        secondaryColor: organizations.secondaryColor,
        followedAt: organizationFollows.createdAt,
      })
      .from(organizationFollows)
      .innerJoin(organizations, eq(organizationFollows.orgId, organizations.id))
      .where(eq(organizationFollows.userId, userId))
      .orderBy(organizationFollows.createdAt);

    const result: OrganizationFollowDto[] = [];

    for (const follow of follows) {
      // Get feed item count
      const [feedItemCountResult] = await this.db
        .select({ count: count() })
        .from(orgFeedItems)
        .where(and(eq(orgFeedItems.orgId, follow.id), eq(orgFeedItems.isPublished, true)));

      // Get title count
      const [titleCountResult] = await this.db
        .select({ count: count() })
        .from(orgTitles)
        .where(eq(orgTitles.orgId, follow.id));

      result.push({
        id: follow.id,
        name: follow.name,
        description: follow.description,
        website: follow.website,
        logoUrl: follow.logoUrl,
        primaryColor: follow.primaryColor,
        secondaryColor: follow.secondaryColor,
        followedAt: follow.followedAt,
        feedItemCount: feedItemCountResult.count,
        titleCount: titleCountResult.count,
      });
    }

    return result;
  }

  async isFollowing(userId: string, orgId: string): Promise<boolean> {
    const [follow] = await this.db
      .select()
      .from(organizationFollows)
      .where(and(eq(organizationFollows.userId, userId), eq(organizationFollows.orgId, orgId)));
    return !!follow;
  }
}
