import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { ValidateUserDTO } from './dto/validate-user.dto';
import { TokenService } from './token.service';

@Controller('validate')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('token')
  async validateToken(@Body() tokenValidate: ValidateTokenDTO) {
    const validToken = await this.tokenService.validateToken(tokenValidate);

    return validToken;
  }

  @Post('user')
  @HttpCode(HttpStatus.NO_CONTENT)
  async validateUser(@Body() { token }: ValidateUserDTO) {
    return await this.tokenService.validateUser({
      token,
      type: 'ConfirmationUser',
    });
  }
}
