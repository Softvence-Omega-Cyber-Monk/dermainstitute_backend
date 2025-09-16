import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApproveUserDto, UpdateAdminDto } from './dto/update-admin.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { RolesGuard } from 'src/utils/authorization/roles.guard';
import { Roles } from 'src/utils/authorization/roles.decorator';
import { Role } from 'src/utils/authorization/role.enum';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // get all
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SuperAdmin,Role.Admin)
  async findAll() {
    try {
      const res = await this.adminService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
        data: res,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        data: null,
      };
    }
  }

  // get all recent activity
  @Get('recentActivity')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SuperAdmin,Role.Admin)
  @ApiOperation({ description: 'Get recent activity' })
  async recentAcivity() {
    try {
      const res = await this.adminService.recentActivity();
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
        data: res,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        data: null,
      };
    }
  }

  @Patch('approve/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ApproveUserDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SuperAdmin,Role.Admin)
  @UseInterceptors(AnyFilesInterceptor()) // Important for parsing multipart/form-data
  async approve(@Param('id') id: string, @Body() req: ApproveUserDto) {
    try {
      const res = await this.adminService.approve(id, req);
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
        data: res,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        data: null,
      };
    }
  }

  @Get('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SuperAdmin,Role.Admin)
  @ApiOperation({ description: 'Get all users' })
  async getAllUsers() {
    try {
      const res = await this.adminService.getAllUsers();
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
        data: res,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        data: null,
      };
    }
  }

  @Get('user/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SuperAdmin,Role.Admin)
  async findOne(@Param('id') id: string) {
    try {
      const res = await this.adminService.findOne(id);
      return {
        satusCode: HttpStatus.OK,
        message: 'success',
        data: res,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        data: null,
      };
    }
  }

  @Delete('user/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SuperAdmin,Role.Admin)
  @ApiOperation({
    summary: 'Delete a user by ID',
    description: 'Removes a user from the system using their unique ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the user to delete',
    example: '12345',
  })
  async remove(@Param('id') id: string) {
    try {
      const res = await this.adminService.remove(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
        data: res,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        data: null,
      };
    }
  }
}
