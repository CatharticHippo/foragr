import { Injectable, Inject } from '@nestjs/common';
import { eq, and, gte, sql, count, desc } from 'drizzle-orm';
import { DrizzleDatabase } from '../database/database.types';
import { 
  users, 
  donations, 
  attendance, 
  xpEvents, 
  userOrgTitles, 
  orgTitles, 
  organizations, 
  organizationFollows 
} from '../database/schema';
import { ProfileProgressDto, ProfileStatusDto, UserOrgTitleDto, UserStatus } from './dto/profile-status.dto';

@Injectable()
export class ProfileService {
  constructor(
    @Inject('DB_CONNECTION')
    private db: DrizzleDatabase,
  ) {}

  async getProfileProgress(userId: string): Promise<ProfileProgressDto> {
    // Get user status
    const status = await this.computeUserStatus(userId);
    
    // Get user titles
    const titles = await this.getUserTitles(userId);
    
    // Get followed organizations count
    const [followedOrgsResult] = await this.db
      .select({ count: count() })
      .from(organizationFollows)
      .where(eq(organizationFollows.userId, userId));

    return {
      status,
      titles,
      followedOrgsCount: followedOrgsResult.count,
    };
  }

  private async computeUserStatus(userId: string): Promise<ProfileStatusDto> {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);

    // Check for recent donations (last 12 months)
    const [recentDonation] = await this.db
      .select()
      .from(donations)
      .where(
        and(
          eq(donations.userId, userId),
          gte(donations.createdAt, twelveMonthsAgo),
        ),
      )
      .limit(1);

    // Check for verified volunteer attendance (last 12 months)
    const [recentAttendance] = await this.db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.userId, userId),
          eq(attendance.supervisorVerified, true),
          gte(attendance.createdAt, twelveMonthsAgo),
        ),
      )
      .limit(1);

    // Determine status based on precedence: Donor > Volunteer > Member
    let status: UserStatus;
    let verified: boolean;
    let since: Date | undefined;

    if (recentDonation) {
      status = UserStatus.DONOR;
      verified = true;
      since = recentDonation.createdAt;
    } else if (recentAttendance) {
      status = UserStatus.VOLUNTEER;
      verified = true;
      since = recentAttendance.createdAt;
    } else {
      status = UserStatus.MEMBER;
      verified = false;
      since = undefined;
    }

    // Get total XP
    const [xpResult] = await this.db
      .select({ totalXp: sql<number>`COALESCE(SUM(${xpEvents.xpAmount}), 0)` })
      .from(xpEvents)
      .where(eq(xpEvents.userId, userId));

    const totalXp = xpResult.totalXp || 0;

    // Calculate level and progress
    const { level, nextLevelAt, progressPercentage } = this.calculateLevelProgress(totalXp);

    // Get status color token
    const colorToken = this.getStatusColorToken(status);

    return {
      status,
      colorToken,
      verified,
      since,
      xp: totalXp,
      level,
      nextLevelAt,
      progressPercentage,
    };
  }

  private async getUserTitles(userId: string): Promise<UserOrgTitleDto[]> {
    const titles = await this.db
      .select({
        id: userOrgTitles.titleId,
        orgId: userOrgTitles.orgId,
        orgName: organizations.name,
        code: orgTitles.code,
        name: orgTitles.name,
        description: orgTitles.description,
        borderToken: orgTitles.borderToken,
        iconToken: orgTitles.iconToken,
        awardedAt: userOrgTitles.awardedAt,
        xpReward: orgTitles.xpReward,
      })
      .from(userOrgTitles)
      .innerJoin(orgTitles, eq(userOrgTitles.titleId, orgTitles.id))
      .innerJoin(organizations, eq(userOrgTitles.orgId, organizations.id))
      .where(eq(userOrgTitles.userId, userId))
      .orderBy(desc(userOrgTitles.awardedAt));

    return titles;
  }

  private calculateLevelProgress(totalXp: number): { level: number; nextLevelAt: number; progressPercentage: number } {
    // Simple level calculation: every 1000 XP = 1 level
    const level = Math.floor(totalXp / 1000) + 1;
    const currentLevelXp = (level - 1) * 1000;
    const nextLevelXp = level * 1000;
    const progressXp = totalXp - currentLevelXp;
    const progressPercentage = Math.round((progressXp / 1000) * 100);

    return {
      level,
      nextLevelAt: nextLevelXp,
      progressPercentage: Math.min(progressPercentage, 100),
    };
  }

  private getStatusColorToken(status: UserStatus): string {
    switch (status) {
      case UserStatus.DONOR:
        return '#F59E0B'; // amber
      case UserStatus.VOLUNTEER:
        return '#10B981'; // green
      case UserStatus.MEMBER:
      default:
        return '#1F6FEB'; // blue
    }
  }
}
