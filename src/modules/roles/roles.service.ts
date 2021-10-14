import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ name, description }: CreateRoleDto) {
    const roleAlreadyExist = await this.prisma.role.findUnique({
      where: { name: name.toLocaleUpperCase() },
    });

    if (roleAlreadyExist) {
      throw new BadRequestException('Role already exists');
    }

    const role = await this.prisma.role.create({
      data: { name, description },
    });

    return role;
  }

  async findAll() {
    const roles = await this.prisma.role.findMany({});

    return roles;
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({ where: { id } });

    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    return role;
  }

  async update(id: number, { name, description }: UpdateRoleDto) {
    const role = await this.prisma.role.findUnique({ where: { id } });

    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    const roleUpdated = await this.prisma.role.update({
      where: { id },
      data: { name, description },
    });

    return roleUpdated;
  }

  async remove(id: number) {
    const role = await this.prisma.role.findUnique({ where: { id } });

    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    await this.prisma.role.delete({ where: { id } });

    return;
  }
}
