import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ApproveUserDto, UpdateAdminDto } from './dto/update-admin.dto';
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
      status:"active",
      isApproved: true,
    },
  });

  return {
    message: `User ${id} approved successfully`,
    user: updatedUser,
  };
}

async getAllUsers(){
  const res = await this.prisma.credential.findMany({
    where: {
      isApproved: false
    }
  });
  return res;
}


async findOne(id:string){
  const res = await this.prisma.credential.findUnique({
    where: {
      id
    }
  });
  return res;
}
}
