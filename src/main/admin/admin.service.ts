import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ApproveUserDto, UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from 'generated/prisma';
import {
  subDays,
  startOfWeek,
  subMonths,
  startOfMonth,
} from 'date-fns';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const now = new Date();
      const thirtyDaysAgo = subDays(now, 30);
      const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });
      const startOfThisMonth = startOfMonth(now);
      const startOfLastMonth = startOfMonth(subMonths(now, 1));

      const [
        totalCredentials,
        totalSOPs,
        totalIncidentReports,
        incidentReportsLast30Days,
        sopsThisWeek,
        usersThisMonth,
        usersLastMonth,
      ] = await Promise.all([
        this.prisma.credential.count(),
        this.prisma.sOP.count(),
        this.prisma.incidentReport.count(),
        this.prisma.incidentReport.count({
          where: { createdAt: { gte: thirtyDaysAgo } },
        }),
        this.prisma.sOP.count({
          where: { createdAt: { gte: startOfThisWeek } },
        }),
        this.prisma.credential.count({
          where: { createdAt: { gte: startOfThisMonth } },
        }),
        this.prisma.credential.count({
          where: {
            createdAt: {
              gte: startOfLastMonth,
              lt: startOfThisMonth,
            },
          },
        }),
      ]);

      let userGrowthPercentage = 0;
      if (usersLastMonth > 0) {
        userGrowthPercentage =
          ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100;
      } else if (usersThisMonth > 0) {
        userGrowthPercentage = 100;
      }

      return {
        totals: {
          totalCredentials,
          totalSOPs,
          totalIncidentReports,
        },
        insights: {
          incidentReportsLast30Days,
          sopsThisWeek,
          users: {
            thisMonth: usersThisMonth,
            lastMonth: usersLastMonth,
            growthPercentage: `${userGrowthPercentage.toFixed(2)}%`,
          },
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }


  async recentActivity() {
    try {
      const [sopActivity, incidentReportActivity, credentialsActivity] =
        await Promise.all([
          this.prisma.sOP.findMany({
            take: 2,
            orderBy: { createdAt: 'desc' },
          }),
          this.prisma.incidentReport.findMany({
            take: 2,
            orderBy: { createdAt: 'desc' },
          }),
          this.prisma.credential.findMany({
            take: 2,
            orderBy: { createdAt: 'desc' },
          }),
        ]);

      return {
        sopActivity,
        incidentReportActivity,
        credentialsActivity,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }


  async approve(id: string, dto: ApproveUserDto) {
    const user = await this.prisma.credential.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updatedUser = await this.prisma.credential.update({
      where: { id },
      data: {
        role: dto.role,
        jurisdiction: dto.jurisdiction,
        institution: dto.institution,
        department: dto.department,
        specialization: dto.specialization,
        status: 'active',
        isApproved: true,
      },
    });

    return {
      message: `User ${id} approved successfully`,
      user: updatedUser,
    };
  }

  async getAllUsers() {
    return this.prisma.credential.findMany({
      where: {
        role: { not: UserRole.SUPER_ADMIN },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.credential.findUnique({ where: { id } });
  }

  async remove(id: string) {
    try {
      const res = await this.prisma.credential.delete({ where: { id } });
      return {
        message: `User ${id} deleted successfully`,
        user: res,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }
}
