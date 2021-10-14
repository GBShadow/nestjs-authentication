import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { ErrorRequestSwagger } from 'src/shared/helpers/swagger/error-request.swagger';
import { UnauthorizedRequestSwagger } from 'src/shared/helpers/swagger/unauthorized-request.swagger';
import { BadRequestSwagger } from 'src/shared/helpers/swagger/bad-request.swagger';
import { CreateRoleSwagger } from './swagger/create-role-swagger';
import { UpdateRoleSwagger } from './swagger/update-role-swagger';
import { Roles } from 'src/shared/guards/decorators/roles.decorator';

@Controller('roles')
@ApiTags('roles')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles('ADM')
  @ApiOperation({ summary: 'Create a new role.' })
  @ApiResponse({
    status: 201,
    description: 'Role created with success.',
    type: CreateRoleSwagger,
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
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Roles('ADM')
  @ApiOperation({ summary: 'List all roles.' })
  @ApiResponse({
    status: 200,
    description: 'Role listed with success.',
    type: CreateRoleSwagger,
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
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Roles('ADM')
  @ApiOperation({ summary: 'Show a role by id.' })
  @ApiResponse({
    status: 200,
    description: 'Role showed with success.',
    type: CreateRoleSwagger,
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
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Put(':id')
  @Roles('ADM')
  @ApiOperation({ summary: 'Update a role by id.' })
  @ApiResponse({
    status: 200,
    description: 'Role updated with success.',
    type: UpdateRoleSwagger,
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
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @Roles('ADM')
  @ApiOperation({ summary: 'Delete a role by id.' })
  @ApiResponse({
    status: 204,
    description: 'Role deleted with success.',
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
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
