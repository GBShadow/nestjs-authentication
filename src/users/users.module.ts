import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionsModule } from './sessions/sessions.module';
import { DiskStorageService } from 'src/providers/disk-storage/disk-storage.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, DiskStorageService],
  imports: [SessionsModule],
})
export class UsersModule {}
