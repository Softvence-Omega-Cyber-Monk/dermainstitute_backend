import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // get all 
  @Get()
  async findAll() {
    try {
      const res = await this.adminService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
        data: res,
      };
    } catch (error) {
       return{
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        data: null
      }
    }
  }

  // get all recent activity
  @Get('recentActivity')
  @ApiOperation({description: 'Get recent activity'})
  async recentAcivity() {
    try {
      const res = await this.adminService.recentActivity();
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
        data: res,
      };
    } catch (error) {
      return{
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        data: null
      }
    }
  }
}
