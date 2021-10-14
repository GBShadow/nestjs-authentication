import { ApiProperty } from '@nestjs/swagger';

class User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  roles: string[];
}

export class CreateSessionSwagger {
  @ApiProperty({ type: User })
  user: User;

  @ApiProperty()
  token: string;
}
