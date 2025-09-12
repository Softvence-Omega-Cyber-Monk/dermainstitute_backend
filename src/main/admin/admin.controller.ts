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
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApproveUserDto, UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

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

   @Patch('approve/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ApproveUserDto })
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
  @ApiOperation({description: 'Get all users'})
  async getAllUsers() {
    try {
      const res = await this.adminService.getAllUsers();
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

  @Get('user/:id')
  async findOne(@Param('id') id: string) {
    try{
      const res=await this.adminService.findOne(id);
    return{
      satusCode: HttpStatus.OK,
      message: 'success',
      data: res
    }
  }catch(error){
    return{
      statusCode: HttpStatus.BAD_REQUEST,
      message: error.message,
      data: null
    }
  }
    }
}
