import { User, Role } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class UserEntity implements User {
  id: number;

  name: string;

  email: string;

  @Exclude()
  password: string;

  phone: string;

  @Exclude()
  avatar: string;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    return `${process.env.APP_API_URL}/files/avatars/${this.avatar}`;
  }

  roles: Role[];

  createdAt: Date;

  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
