// report.service.ts

import { Injectable } from '@nestjs/common';

import { CreateIncidentReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Status } from './dto/create-report.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Situation } from 'generated/prisma';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReportDto: CreateIncidentReportDto) {
    try {
      return await this.prisma.incidentReport.create({
        data: {
          ...createReportDto,
          situation: createReportDto.situation,
          status: createReportDto.status as Status,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error(
        'Failed to create incident report due to a database error.',
      );
    }
  }

  async findAll(situation?: Situation, title?: string) {
    const where: any = {};

    if (situation) {
      where.situation = situation;
    }

    if (title) {
      where.incidentTitle = {
        contains: title,
        mode: 'insensitive',
      };
    }

    try {
      return await this.prisma.incidentReport.findMany({
        where,
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve incident reports from the database.');
    }
  }

  async findOne(id: string) {
    try {
      const report = await this.prisma.incidentReport.findUnique({
        where: { id },
      });
      return report;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to find incident report with ID ${id}.`);
    }
  }

  async update(id: string, updateReportDto: UpdateReportDto) {
    try {
      const updatedReport = await this.prisma.incidentReport.update({
        where: { id },
        data: updateReportDto,
      });
      return updatedReport;
    } catch (error) {
      // Check if the error is a record not found.
      if (error.code === 'P2025') {
        return null;
      }
      console.error(error);
      throw new Error(`Failed to update incident report with ID ${id}.`);
    }
  }

  async remove(id: string) {
    try {
      const deletedReport = await this.prisma.incidentReport.delete({
        where: { id },
      });
      return deletedReport;
    } catch (error) {
      // Check if the error is a record not found.
      if (error.code === 'P2025') {
        return null;
      }
      console.error(error);
      throw new Error(`Failed to delete incident report with ID ${id}.`);
    }
  }
}
