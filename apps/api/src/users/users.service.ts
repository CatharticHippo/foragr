import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { eq, and, sql } from 'drizzle-orm';
import { users, xpEvents, userBadges, badges } from '../database/schema';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(@Inject('DB_CONNECTION') private db: any) {}

  async create(createUserDto: CreateUserDto) {
    const [user] = await this.db
      .insert(users)
      .values(createUserDto)
      .returning();

    return user;
  }

  async findAll(limit = 20, offset = 0) {
    return this.db
      .select()
      .from(users)
      .where(eq(users.isActive, true))
      .limit(limit)
      .offset(offset);
  }

  async findById(id: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.isActive, true)));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.isActive, true)));

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const [user] = await this.db
      .update(users)
      .set({ ...updateUserDto, updatedAt: new Date() })
      .where(and(eq(users.id, id), eq(users.isActive, true)))
      .returning();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async remove(id: string) {
    const [user] = await this.db
      .update(users)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(users.id, id), eq(users.isActive, true)))
      .returning();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deactivated successfully' };
  }

  async getUserStats(userId: string) {
    // Get total XP
    const xpResult = await this.db
      .select({ totalXp: sql<number>`COALESCE(SUM(${xpEvents.xpAmount}), 0)` })
      .from(xpEvents)
      .where(eq(xpEvents.userId, userId));

    // Get badge count
    const badgeResult = await this.db
      .select({ badgeCount: sql<number>`COUNT(*)` })
      .from(userBadges)
      .where(eq(userBadges.userId, userId));

    // Get user level (every 1000 XP = 1 level, starting at level 1)
    const totalXp = xpResult[0]?.totalXp || 0;
    const level = Math.max(1, Math.floor(totalXp / 1000) + 1);

    return {
      totalXp,
      badgeCount: badgeResult[0]?.badgeCount || 0,
      level,
    };
  }

  async getUserBadges(userId: string) {
    return this.db
      .select({
        id: userBadges.id,
        earnedAt: userBadges.earnedAt,
        badge: {
          id: badges.id,
          name: badges.name,
          description: badges.description,
          iconUrl: badges.iconUrl,
          category: badges.category,
        },
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId))
      .orderBy(userBadges.earnedAt);
  }

  async getUserXpHistory(userId: string, limit = 50, offset = 0) {
    return this.db
      .select()
      .from(xpEvents)
      .where(eq(xpEvents.userId, userId))
      .orderBy(xpEvents.createdAt)
      .limit(limit)
      .offset(offset);
  }
}
