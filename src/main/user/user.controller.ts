import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  Request,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { UpdateCredentialDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMe(@Request() req) {
    const user = req.user;
    try {
      const result = await this.userService.getMe(user);
      return {
        statusCode: 200,
        success: true,
        message: 'User retrieved successfully Done',
        data: result,
      };
    } catch (error) {
       return{
              statusCode: HttpStatus.BAD_REQUEST,
              message: error.message,
              data: null
            }
    }
  }

  @Patch('update-profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateCredentialDto })
  async updateProfile(
    @Body() updateCredentialDto: UpdateCredentialDto,
    @UploadedFile() image: Express.Multer.File,
    @Request() req,
  ) {
    const user = req.user;
    try {
      const result = await this.userService.updateProfile(
        user,
        updateCredentialDto,
        image,
      );
      return {
        statusCode: 200,
        success: true,
        message: 'User updated successfully',
        data: result,
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
