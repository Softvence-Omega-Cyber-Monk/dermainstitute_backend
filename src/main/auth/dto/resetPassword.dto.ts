import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ title: ' token', description: 'give your verification token' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ title: 'new password', description: 'give your new password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
