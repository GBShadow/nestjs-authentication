import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
@ApiTags('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  async create(@Body() { email, password }: CreateSessionDto) {
    const { user, token } = await this.sessionsService.create({
      email,
      password,
    });

    return { user, token };
  }
}
