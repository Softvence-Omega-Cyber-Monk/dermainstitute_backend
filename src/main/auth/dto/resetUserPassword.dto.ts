import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetUserPasswordDto {
  @ApiProperty({ title: '', description: '' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ title: '', description: '' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
