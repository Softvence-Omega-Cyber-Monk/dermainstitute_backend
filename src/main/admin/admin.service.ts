import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }
  async findAll() {
    try {
      const [totalCredentials, totalSOPs, totalIncidentReports] =
        await Promise.all([
          this.prisma.credential.count(),
          this.prisma.sOP.count(),
          this.prisma.incidentReport.count(),
        ]);
      return {
        totalCredentials,
        totalSOPs,
        totalIncidentReports,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async recentActivity() {
    try {
      const [sopActivity, incidentReportActivity, credentialsActivity] = await Promise.all([
        await this.prisma.sOP.findMany({
          take: 2,
          orderBy: {
            createdAt: 'desc',
          },
          
        }),
        await this.prisma.incidentReport.findMany({
          take: 2,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        await this.prisma.credential.findMany({
          take: 2,
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);
      return {
       sopActivity,
       incidentReportActivity,
       credentialsActivity
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
