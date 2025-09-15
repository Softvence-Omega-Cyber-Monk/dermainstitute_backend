import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Controller('medicine')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  async create(@Body() createMedicineDto: CreateMedicineDto) {
   try{
     const res=await this.medicineService.create(createMedicineDto);
  return{
    statusCode:200,
    message:'Medicine created successfully',
    data:res
  }
   }catch(error){
    return{
      statusCode:400,
      message:error.message,
      data:null
    }
   }
  }

  @Get()
 async findAll() {
   try{
     const res=await this.medicineService.findAll();
    return{
      statusCode:200,
      message:'Medicines fetched successfully',
      data:res
    }
   }catch(error){
    return{
      statusCode:400,
      message:error.message,
      data:null
    }
   }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res=await this.medicineService.remove(id);
    return{
      statusCode:200,
      message:'Medicine deleted successfully',
      data:res
    }
  }
}
