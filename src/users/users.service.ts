import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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

  async remove(id: number) {
    await this.prisma.user.delete({ where: { id } });

    return;
  }
}
