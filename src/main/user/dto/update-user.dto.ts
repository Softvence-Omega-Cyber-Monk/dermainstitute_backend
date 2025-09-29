import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, validate, ValidateIf } from 'class-validator';

export class UpdateCredentialDto {
  @ApiProperty({
    description: 'The first name of the user.',
    required: false,
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the user.',
    required: false,
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'The phone number of the user.',
    required: false,
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'The jurisdiction of the user.',
    required: false,
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  jurisdiction?: string;

  @ApiProperty({
    description: 'The user’s institution.',
    required: false,
    example: 'University of XYZ',
  })
  @IsOptional()
  @IsString()
  institution?: string;

  @ApiProperty({
    description: 'The user’s department.',
    required: false,
    example: 'Computer Science',
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({
    description: 'The user’s specialization.',
    required: false,
    example: 'Data Analytics',
  })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The image file to upload.',
    required: false,
  })
  @ValidateIf(() => false)
  image?: any;

  @ApiProperty({
    description: 'Notification setting.',
    required: false,
    example: 'true',
  })
  @IsOptional()
  @IsString()
  notification?: string;
  @ApiProperty({
    description: 'Alert setting.',
    required: false,
    example: 'true',
  })
  @IsOptional()
  @IsString()
  emargencyAlert?: string;
}
