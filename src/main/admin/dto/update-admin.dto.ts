import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { IsString } from 'class-validator';
import { UserRole } from 'generated/prisma';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}

export class ApproveUserDto {
  @ApiProperty({ example: 'Admin' })
  @IsString()
  role: UserRole;

  @ApiProperty({ example: 'National' })
  @IsString()
  jurisdiction: string;

  @ApiProperty({ example: 'University of Dhaka' })
  @IsString()
  institution: string;

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  department: string;

  @ApiProperty({ example: 'Artificial Intelligence' })
  @IsString()
  specialization: string;
}
