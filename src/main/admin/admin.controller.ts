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
import { ApiBody } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async findAll() {
   try{
    const res=await this.adminService.findAll();
    return{
      statusCode:HttpStatus.OK
      ,message:'success',
      data:res
    }
   }catch(error){
    throw new HttpException(error.message, error.status)
   }
  }

  
}
