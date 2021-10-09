import { User, Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  id: number;

  name: string;

  email: string;

  @Exclude()
  password: string;

  phone: string;

  roles: Role[];

  createdAt: Date;

  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
