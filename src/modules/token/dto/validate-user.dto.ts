import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateUserDTO {
  @IsString()
  @IsNotEmpty()
  token: string;
}
