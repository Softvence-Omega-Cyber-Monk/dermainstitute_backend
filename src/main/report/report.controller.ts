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
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { UpdateReportDto } from './dto/update-report.dto';
import { CreateIncidentReportDto } from './dto/create-report.dto';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Situation } from './dto/create-report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async create(@Body() createReportDto: CreateIncidentReportDto) {
    try {
      return await this.reportService.create(createReportDto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create the incident report.');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all incident reports', description: 'Returns a list of all reports with optional filtering and search.' })
  @ApiOkResponse({ description: 'A list of incident reports.', isArray: true })
  @ApiQuery({
    name: 'situation',
    required: false,
    enum: Situation,
    description: 'Filter reports by situation (Low, Medium, High, Critical).'
  })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Search for reports by incident title using a partial, case-insensitive match.'
  })
  async findAll(@Query('situation') situation?: Situation, @Query('title') title?: string) {
    return await this.reportService.findAll(situation, title);
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const report = await this.reportService.findOne(id);
      if (!report) {
        throw new HttpException('Incident report not found.', HttpStatus.NOT_FOUND);
      }
      return report;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new InternalServerErrorException('Failed to retrieve the incident report.');
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    try {
      const updatedReport = await this.reportService.update(id, updateReportDto);
      if (!updatedReport) {
        throw new HttpException('Incident report not found.', HttpStatus.NOT_FOUND);
      }
      return updatedReport;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update the incident report.');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deletedReport = await this.reportService.remove(id);
      if (!deletedReport) {
        throw new HttpException('Incident report not found.', HttpStatus.NOT_FOUND);
      }
      return deletedReport;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete the incident report.');
    }
  }
}