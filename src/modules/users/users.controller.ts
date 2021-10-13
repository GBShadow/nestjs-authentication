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

import uploadConfig from '../../config/upload';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserSwagger } from './swagger/create-user-swagger';
import { UpdateUserSwagger } from './swagger/update-user-swagger';
import { UserEntity } from './entities/user.entity';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/guards/decorators/roles.decorator';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('ADM')
  @ApiOperation({ summary: 'Cria um novo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario criado com sucesso',
    type: CreateUserSwagger,
  })
  @ApiResponse({ status: 401, description: 'Não Autorizado' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return new UserEntity(user);
  }

  @Get()
  @Roles('ADM')
  @ApiOperation({ summary: 'Lista todos os usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios retornada com sucesso',
    type: UpdateUserSwagger,
    isArray: true,
  })
  async findAll() {
    const users = await this.usersService.findAll();

    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @Roles('ADM')
  @ApiOperation({ summary: 'Lista um usuario pelo id' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    console.log(req.user);
    const user = await this.usersService.findById(id);
    return new UserEntity(user);
  }

  @Put(':id')
  @Roles('ADM')
  @ApiOperation({ summary: 'Atualiza um usuario pelo id' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);

    return new UserEntity(user);
  }

  @Patch('avatar/:id')
  @Roles('ADM')
  @ApiOperation({ summary: 'Atualiza o avatar do usuario polo id' })
  @UseInterceptors(FileInterceptor('avatar', uploadConfig))
  async updateAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const user = await this.usersService.updateAvatar({
      id,
      avatarFileName: avatar.filename,
    });

    return new UserEntity(user);
  }

  @Delete(':id')
  @Roles('ADM')
  @ApiOperation({ summary: 'Deleta um usuario pelo id' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
