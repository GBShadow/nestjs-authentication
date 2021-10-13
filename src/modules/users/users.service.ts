import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { SendMailProducerService } from 'src/shared/jobs/sendMail-producer-service';
import { DiskStorageService } from 'src/shared/providers/disk-storage/disk-storage.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserAvatarDto } from './dto/update-user-avatar.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private diskStorage: DiskStorageService,
    private sendMailService: SendMailProducerService,
  ) {}

  async create({ email, name, password, phone, roles }: CreateUserDto) {
    const userAlreadyExist = await this.findByEmail(email);

    if (userAlreadyExist) {
      throw new BadRequestException('User already exist.');
    }

    const rolesExists = await this.prisma.role.findMany({
      where: { name: { in: roles } },
      select: { id: true },
    });

    if (rolesExists.length === 0) {
      throw new NotFoundException('Roles not found.');
    }

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

    this.sendMailService.sendMail({ name, email });

    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: { roles: true },
    });

    return users;
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { roles: true },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
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
    { email, name, old_password, password, phone, roles }: UpdateUserDto,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const rolesExists = await this.prisma.role.findMany({
      where: { name: { in: roles } },
      select: { id: true },
    });

    if (rolesExists.length === 0) {
      throw new NotFoundException('Roles not found.');
    }

    if (old_password && password) {
      const matchedPassword = await compare(old_password, user.password);

      if (!matchedPassword) {
        throw new BadRequestException('Password does not matched.');
      }

      const passwordHash = await hash(password, 8);

      const userUpdated = await this.prisma.user.update({
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

      return userUpdated;
    }

    const userUpdated = await this.prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        roles: { set: [...rolesExists] },
      },
      include: { roles: true },
    });

    return userUpdated;
  }

  async updateAvatar({ id, avatarFileName }: UpdateUserAvatarDto) {
    const user = await this.findById(id);

    if (user.avatar) {
      await this.diskStorage.deleteFile(user.avatar);
    }

    const fileName = await this.diskStorage.saveFile(avatarFileName);

    const userUpdated = await this.prisma.user.update({
      where: { id },
      data: { avatar: fileName },
      include: { roles: true },
    });

    return userUpdated;
  }

  async remove(id: number) {
    await this.findById(id);

    await this.prisma.user.delete({ where: { id } });

    return;
  }
}
