import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class SessionsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async create({ email, password }: CreateSessionDto) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Incorrect e-mail/password combination');
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
