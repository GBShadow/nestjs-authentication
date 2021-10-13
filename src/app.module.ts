import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { DiskStorageService } from './shared/providers/disk-storage/disk-storage.service';
import { SessionsModule } from './modules/users/sessions/sessions.module';
import { JobsModule } from './shared/jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    JobsModule,
    RolesModule,
    UsersModule,
    SessionsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    DiskStorageService,
  ],
})
export class AppModule {}
