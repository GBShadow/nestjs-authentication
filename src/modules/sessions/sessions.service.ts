import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class SessionsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async create({ email, password }: CreateSessionDto) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Incorrect e-mail/password combination');
    }

    if (!user.active) {
      throw new UnauthorizedException('Email not confirmed');
    }

    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect e-mail/password combination');
    }

    const userSerialized = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles.map((role) => role.name),
    };

    return {
      user: userSerialized,
      token: this.jwtService.sign({ sub: user.id }),
    };
  }
}
