import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestSwagger } from 'src/shared/helpers/swagger/bad-request.swagger';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsService } from './sessions.service';
import { CreateSessionSwagger } from './swagger/create-session-swagger';

@Controller('sessions')
@ApiTags('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Login in application.' })
  @ApiResponse({
    status: 200,
    description: 'Login successfully.',
    type: CreateSessionSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data.',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Incorrect e-mail/password combination.',
    type: CreateSessionSwagger,
  })
  async create(@Body() { email, password }: CreateSessionDto) {
    const { user, token } = await this.sessionsService.create({
      email,
      password,
    });

    return { user, token };
  }
}
