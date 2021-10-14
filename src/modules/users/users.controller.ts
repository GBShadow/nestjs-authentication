import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
  Patch,
  UploadedFile,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import uploadConfig from '../../config/upload';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserSwagger } from './swagger/create-user-swagger';
import { UpdateUserSwagger } from './swagger/update-user-swagger';
import { UserEntity } from './entities/user.entity';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/guards/decorators/roles.decorator';
import { ShowUserSwagger } from './swagger/show-user-swagger';
import { UnauthorizedRequestSwagger } from 'src/shared/helpers/swagger/unauthorized-request.swagger';
import { BadRequestSwagger } from 'src/shared/helpers/swagger/bad-request.swagger';
import { ErrorRequestSwagger } from 'src/shared/helpers/swagger/error-request.swagger';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('ADM')
  @ApiOperation({ summary: 'Create a new user.' })
  @ApiResponse({
    status: 201,
    description: 'User created with success.',
    type: CreateUserSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data.',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authorized.',
    type: UnauthorizedRequestSwagger,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource.',
    type: ErrorRequestSwagger,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return new UserEntity(user);
  }

  @Get()
  @Roles('ADM')
  @ApiOperation({ summary: 'List all users.' })
  @ApiResponse({
    status: 200,
    description: 'List of user returned with success.',
    type: ShowUserSwagger,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authorized.',
    type: UnauthorizedRequestSwagger,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource.',
    type: ErrorRequestSwagger,
  })
  async findAll() {
    const users = await this.usersService.findAll();

    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @Roles('ADM')
  @ApiOperation({ summary: 'Show a user by id. ' })
  @ApiResponse({
    status: 200,
    description: 'User returned with success.',
    type: ShowUserSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid type data in params.',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authorized.',
    type: UnauthorizedRequestSwagger,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource.',
    type: ErrorRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    type: ErrorRequestSwagger,
  })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    console.log(req.user);
    const user = await this.usersService.findById(id);
    return new UserEntity(user);
  }

  @Put(':id')
  @Roles('ADM')
  @ApiOperation({ summary: 'Update user by id.' })
  @ApiResponse({
    status: 200,
    description: 'User updated with success.',
    type: UpdateUserSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid type data in params.',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data.',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authorized.',
    type: UnauthorizedRequestSwagger,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource.',
    type: ErrorRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    type: ErrorRequestSwagger,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);

    return new UserEntity(user);
  }

  @Patch('avatar/:id')
  @Roles('ADM')
  @ApiOperation({ summary: "Updated user's avatar by id." })
  @ApiResponse({
    status: 200,
    description: 'User returned with success.',
    type: ShowUserSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid type data in params.',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data.',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authorized.',
    type: UnauthorizedRequestSwagger,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource.',
    type: ErrorRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    type: ErrorRequestSwagger,
  })
  @UseInterceptors(FileInterceptor('avatar', uploadConfig))
  async updateAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const user = await this.usersService.updateAvatar({
      id,
      avatar: avatar,
    });

    return new UserEntity(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('ADM')
  @ApiResponse({
    status: 204,
    description: 'User deleted with success.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid type data in params.',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authorized.',
    type: UnauthorizedRequestSwagger,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource.',
    type: ErrorRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    type: ErrorRequestSwagger,
  })
  @ApiOperation({ summary: 'Deleta um usuario pelo id' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
