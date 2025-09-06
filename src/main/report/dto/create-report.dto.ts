// create-incident-report.dto.ts
import { IsString, IsInt, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Situation {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Crtical = 'Crtical',
}

export enum Status {
  Complete = 'Complete',
  Submitted = 'Submitted',
}

export class CreateIncidentReportDto {
  @ApiProperty({ description: 'The title of the incident report.' })
  @IsString()
  incidentTitle: string;

  @ApiProperty({ description: 'The procedure related to the incident.', required: false })
  @IsOptional()
  @IsString()
  procedure?: string;

  @ApiProperty({ description: 'The severity level of the incident.', required: false })
  @IsOptional()
  @IsString()
  severity?: string;

  @ApiProperty({ description: 'The age of the patient.', required: false })
  @IsOptional()
  @IsInt()
  patientAge?: number;

  @ApiProperty({ description: 'The sex of the patient.', required: false })
  @IsOptional()
  @IsString()
  patientSex?: string;

  @ApiProperty({ description: 'A detailed description of the incident.' })
  @IsString()
  descriptionOfIncident: string;

  @ApiProperty({ enum: Situation, description: 'The situation level of the incident.' })
  @IsEnum(Situation)
  situation: Situation;

  @ApiProperty({ description: 'The actions taken during the incident.' })
  @IsString()
  actionsTaken: string;

  @ApiProperty({ description: 'The outcome of the incident.' })
  @IsString()
  outcome: string;

  @ApiProperty({ description: 'Lessons learned from the incident.' })
  @IsString()
  lessonsLearned: string;

  @ApiProperty({ description: 'Indicates if the report is a draft.', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;

  @ApiProperty({ enum: Status, description: 'The status of the report.', required: false, default: 'Submitted' })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}