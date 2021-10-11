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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import uploadConfig from '../config/upload';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IndexTodoSwagger } from './swagger/index-user-swagger';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario criado com sucesso',
    type: IndexTodoSwagger,
  })
  @ApiResponse({ status: 401, description: 'Não Autorizado' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios retornada com sucesso',
    type: IndexTodoSwagger,
    isArray: true,
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lista um usuario pelo id' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    console.log(req.user);
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um usuario pelo id' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('avatar/:id')
  @ApiOperation({ summary: 'Atualiza o avatar do usuario polo id' })
  @UseInterceptors(FileInterceptor('avatar', uploadConfig))
  updateAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.usersService.updateAvatar({
      id,
      avatarFileName: avatar.filename,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um usuario pelo id' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
