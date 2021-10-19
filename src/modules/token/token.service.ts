import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { randomNumbers } from 'src/shared/helpers/functions/randomNumber';
import { GenerateTokenDTO } from './dto/generate-token.dto';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { addHours, addMinutes, isAfter } from 'date-fns';

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  public async generate({ user_id, email, type }: GenerateTokenDTO) {
    const validToken = await this.generateValidToken(type);

    const userToken = this.prisma.token.create({
      data: {
        user_id,
        token: validToken,
        email,
        type,
      },
    });

    return userToken;
  }

  async validateToken({ token, type }: ValidateTokenDTO) {
    const userToken = await this.findByToken(token, type);

    if (!userToken) {
      throw new NotFoundException('Token not found.');
    }

    const tokenCreatedAt = userToken.createdAt;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new BadRequestException('Token expired');
    }

    const activeToken = await this.prisma.token.update({
      where: { id: userToken.id },
      data: {
        active: true,
      },
    });

    return { token: activeToken.token };
  }

  async validateUser({ token, type }: ValidateTokenDTO) {
    const userToken = await this.findByToken(token, type);

    if (!userToken) {
      throw new NotFoundException('Token not found.');
    }

    if (!userToken.active) {
      throw new BadRequestException('Token inactive');
    }

    const tokenUpdatedAt = userToken.updatedAt;
    const compareDate = addMinutes(tokenUpdatedAt, 5);

    if (isAfter(Date.now(), compareDate)) {
      throw new BadRequestException('Token expired');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userToken.user_id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        active: true,
      },
    });

    return;
  }

  private async findByToken(token: string, type: string) {
    const userToken = await this.prisma.token.findFirst({
      where: { token, type },
    });

    return userToken;
  }

  public async delete(id: number): Promise<void> {
    await this.prisma.token.delete({ where: { id } });
  }

  private async generateValidToken(type: string): Promise<string> {
    const token = randomNumbers();

    const existToken = await this.prisma.token.findFirst({
      where: { token, type },
    });

    if (existToken) {
      this.generateValidToken(type);
    }

    return token;
  }
}
