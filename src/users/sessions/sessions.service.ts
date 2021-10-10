import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionsService {
  create(createSessionDto: CreateSessionDto) {
    return 'This action adds a new session';
  }
}
