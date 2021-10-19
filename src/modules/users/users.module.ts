import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { DiskStorageService } from 'src/shared/providers/disk-storage/disk-storage.service';
import { JobsModule } from 'src/shared/jobs/jobs.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [JobsModule, TokenModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, DiskStorageService],
  exports: [UsersService],
})
export class UsersModule {}
