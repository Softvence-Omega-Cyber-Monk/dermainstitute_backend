import { ApiProperty } from "@nestjs/swagger"
import { IsNumber,IsString } from "class-validator"

export class CreateMedicineDto {
    @ApiProperty({example:'Paracetamol',description:'Name of medicine'})
    @IsString()
    title:string

    @ApiProperty({example:'Adult 0.3-0,5mg 1M, Pediatric 0.01 mg/kg (max 0.3mg)', description:'description for medicine'})
    @IsString()
    description:string
}