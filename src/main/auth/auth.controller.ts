import { Controller, Post, Body, HttpStatus, Get, Query, Patch, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDTO } from './dto/login.dto';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { ResetUserPasswordDto } from './dto/resetUserPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async create(@Body() createAuthDto: CreateAuthDto) {
    try {
      const result = await this.authService.create(createAuthDto);
      return {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'User created successfully',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  @Post('login')
  async login(@Body() LoginDto: LoginDTO) {
    try {
      const result = await this.authService.login(LoginDto);
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Login successful',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  @Post('forget-password')
  @ApiBody({
    type: Object,
    schema: {
      properties: {
        email: { type: 'string', example: 'user@gmail.com' },
      },
    },
  })
  async forgetPassword(@Body() body: { email: string }) {
    console.log(body);
    try {
      const result = await this.authService.forgetPassword(body.email);
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Password reset link sent successfully',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

 @Post('verify-otp')
  @ApiBody({
    schema: {
      properties: {
        otp: { type: 'number' }
      }
    }
  })
  async verifyOTP(@Body() body: {  otp: number }) {
    try {
      const result = await this.authService.verifyOTP( body.otp);
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'OTP verified successfully',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }
  @Post('reset-password')
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() body: { token: string; password: string }) {
    try {
      const result = await this.authService.resetPassword(
        body.token,
        body.password,
      );
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Password reset successful',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }
  @Patch('/user/reset-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type:ResetUserPasswordDto})
  async resetUserPassword(@Body() body: { oldPassword: string; newPassword: string },@Req() req: any) {
    try {
      const user=req.user
      const result = await this.authService.resetUserPassword(
        user.userId,
        body.oldPassword,
        body.newPassword,
      );
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Password reset successful',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }
}
