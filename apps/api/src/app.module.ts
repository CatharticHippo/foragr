import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { FeedModule } from './feed/feed.module';
import { ProfileModule } from './profile/profile.module';
// import { ListingsModule } from './listings/listings.module';
// import { ApplicationsModule } from './applications/applications.module';
// import { AttendanceModule } from './attendance/attendance.module';
// import { DonationsModule } from './donations/donations.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    FeedModule,
    ProfileModule,
    // ListingsModule,
    // ApplicationsModule,
    // AttendanceModule,
    // DonationsModule,
    CommonModule,
  ],
})
export class AppModule {}
