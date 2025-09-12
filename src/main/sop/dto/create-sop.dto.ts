// create-sop.dto.ts
import {
  IsString,
  IsArray,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsNumber,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum SOPStatus {
  Procedure = 'Procedure',
  Emergence = 'Emergence',
}

export class CreateProtocolStepDto {
  @ApiProperty({ description: 'The step number in the protocol.' })
  @IsNumber()
  stepNumber: number;

  @ApiProperty({ description: 'The title of the protocol step.' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'A detailed description of the step.' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'The estimated duration of the step.' })
  @IsOptional()
  @IsString()
  duration?: string;
}

export class CreateMedicationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  dose: string;

  @ApiProperty()
  @IsString()
  route: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  repeat?: string;
}

export class CreateOxygenDto {
  @ApiProperty()
  @IsString()
  dose: string;

  @ApiProperty()
  @IsString()
  route: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  repeat?: string;
}

export class CreateSopDto {
  @ApiProperty({ description: 'The title of the SOP.' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'List of jurisdictions where the SOP applies.',
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsString({ each: true })
  jurisdiction: string[];

  @ApiProperty({
    description: 'List of tags for categorizing the SOP.',
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ description: 'A brief overview of the SOP.' })
  @IsString()
  overview: string;

  @ApiProperty({
    description: 'List of indications for using the SOP.',
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsString({ each: true })
  indications: string[];
  
@ApiProperty({
  description: "Priority",
  default: "High_Priority",
})
@IsOptional()
@IsString()
priority?: string;
@ApiProperty({
  description: "Draft or published",
  default: "Published",
})
@IsOptional()
@IsString()
isDraft?: string;

  @ApiProperty({
    description: 'List of contraindications.',
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsString({ each: true })
  contraindications: string[];

  @ApiProperty({
    description: 'List of required equipment.',
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsString({ each: true })
  required_equipment: string[];

  @ApiProperty({
    enum: SOPStatus,
    description: 'The status of the SOP (e.g., Procedure, Emergence).',
  })
  @IsOptional()
  @IsEnum(SOPStatus)
  status?: SOPStatus;


  @ApiProperty({ description: 'The author of the SOP.' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({
    type: [CreateProtocolStepDto],
    description: 'A list of protocol steps.',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateProtocolStepDto)
  protocolSteps: CreateProtocolStepDto[];

  @ApiProperty({
    type: [CreateMedicationDto],
    description: 'A list of medications.',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateMedicationDto)
  medications: CreateMedicationDto[];

  @ApiProperty({
    type: CreateOxygenDto,
    description: 'Oxygen details for the protocol.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateOxygenDto)
  oxygen?: CreateOxygenDto;
}
