import { HttpException, Injectable } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MedicineService {
  constructor(private prisma:PrismaService){}
  async create(createMedicineDto: CreateMedicineDto) {
    try{
      const res=await this.prisma.medicine.create({
        data:createMedicineDto
      })
      return res
    }catch(error){
      throw new HttpException(error.message,error.status)
    }
  }

  async findAll() {
   try{
     const res=await this.prisma.medicine.findMany()
    return res
   }catch(error){
    throw new HttpException(error.message, error.status)
   }
  }

  async remove(id: string) {
    try{
      const res= this.prisma.medicine.delete({
        where:{
          id:id
        }
      })
      return res
    }catch(error){
      throw new HttpException(error.message, error.status)
    }
  }
}
