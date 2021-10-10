import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiskStorageService } from 'src/providers/disk-storage/disk-storage.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, DiskStorageService],
  exports: [UsersService],
})
export class UsersModule {}
