// sop.service.ts

import { Injectable } from '@nestjs/common';

import { CreateSopDto } from './dto/create-sop.dto';
import { UpdateSopDto } from './dto/update-sop.dto';
import { SOPStatus } from './dto/create-sop.dto'; // Import the SOPStatus enum
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SopService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSopDto: CreateSopDto) {
    try {
      const { protocolSteps, medications, oxygen, ...sopData } = createSopDto;

      return await this.prisma.sOP.create({
        data: {
          ...sopData,
          status: sopData.status as SOPStatus,
          priority: sopData.priority as any,
          protocolSteps: {
            create: protocolSteps,
          },
          medications: {
            create: medications,
          },
          oxygen: oxygen ? { create: oxygen } : undefined,
        },
        include: {
          protocolSteps: true,
          medications: true,
          oxygen: true,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create SOP due to a database error.');
    }
  }

  async findAll(jurisdiction?: string, title?: string, status?: any) {
    try {
      return await this.prisma.sOP.findMany({
        where: {
          jurisdiction: jurisdiction ? { has: jurisdiction } : undefined,
          title: title ? { contains: title, mode: 'insensitive' } : undefined,
          status: status ? { equals: status } : undefined,
        },
        include: {
          protocolSteps: true,
          medications: true,
          oxygen: true,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve SOPs from the database.');
    }
  }

  async findOne(id: string) {
    try {
      const sop = await this.prisma.sOP.findUnique({
        where: { id },
        include: {
          protocolSteps: true,
          medications: true,
          oxygen: true,
        },
      });
      return sop;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to find SOP with ID ${id}.`);
    }
  }

  async update(id: string, updateSopDto: UpdateSopDto) {
    try {
      const { protocolSteps, medications, oxygen, ...sopData } = updateSopDto;

      const updateData: any = {
        ...sopData,
        status: sopData.status as SOPStatus,
      };

      if (protocolSteps) {
        updateData.protocolSteps = {
          deleteMany: {},
          create: protocolSteps,
        };
      }

      if (medications) {
        updateData.medications = {
          deleteMany: {},
          create: medications,
        };
      }

      if (oxygen) {
        updateData.oxygen = {
          update: {
            where: { sopId: id },
            data: oxygen,
          },
        };
      }

      const updatedSop = await this.prisma.sOP.update({
        where: { id },
        data: updateData,
        include: {
          protocolSteps: true,
          medications: true,
          oxygen: true,
        },
      });
      return updatedSop;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to update SOP with ID ${id}.`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.protocolStep.deleteMany({ where: { sopId: id } });
      await this.prisma.medication.deleteMany({ where: { sopId: id } });
      await this.prisma.oxygen.delete({ where: { sopId: id } });

      const deletedSop = await this.prisma.sOP.delete({
        where: { id },
      });
      return deletedSop;
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      console.error(error);
      throw new Error(`Failed to delete SOP with ID ${id}.`);
    }
  }
}
