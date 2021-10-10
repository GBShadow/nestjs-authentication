import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiskStorageService } from 'src/providers/disk-storage/disk-storage.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserAvatarDto } from './dto/update-user-avatar.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private diskStorage: DiskStorageService,
  ) {}

  async create({ email, name, password, phone, roles }: CreateUserDto) {
    const rolesExists = await this.prisma.role.findMany({
      where: { name: { in: roles } },
      select: { id: true },
    });

    const passwordHash = await hash(password, 8);

    const user = await this.prisma.user.create({
      data: {
        name,
        password: passwordHash,
        email,
        phone,
        roles: { connect: [...rolesExists] },
      },
      include: { roles: true },
    });

    return new UserEntity(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: { roles: true },
    });

    return users.map((user) => new UserEntity(user));
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { roles: true },
    });

    return new UserEntity(user);
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });

    return user;
  }

  async update(
    id: number,
    { email, name, password, phone, roles }: UpdateUserDto,
  ) {
    const rolesExists = await this.prisma.role.findMany({
      where: { name: { in: roles } },
      select: { id: true },
    });

    const passwordHash = await hash(password, 8);

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name,
        password: passwordHash,
        email,
        phone,
        roles: { set: [...rolesExists] },
      },
      include: { roles: true },
    });

    return new UserEntity(user);
  }

  async updateAvatar({ id, avatarFileName }: UpdateUserAvatarDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { avatar: true },
    });

    if (user.avatar) {
      await this.diskStorage.deleteFile(user.avatar);
    }

    const fileName = await this.diskStorage.saveFile(avatarFileName);

    const userUpdated = await this.prisma.user.update({
      where: { id },
      data: { avatar: fileName },
      include: { roles: true },
    });

    return new UserEntity(userUpdated);
  }

  async remove(id: number) {
    await this.prisma.user.delete({ where: { id } });

    return;
  }
}
