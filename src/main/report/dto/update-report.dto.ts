import { PartialType } from '@nestjs/swagger';
import { CreateIncidentReportDto } from './create-report.dto';


export class UpdateReportDto extends PartialType(CreateIncidentReportDto) {}
