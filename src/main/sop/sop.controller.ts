// sop.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException, // Import for 404 handling
  BadRequestException, // Import for 400 handling (less common here, but good practice)
  InternalServerErrorException,
  Query,
  UseGuards,
  Req, // Import for 500 handling
} from '@nestjs/common';
import { SopService } from './sop.service';
import { CreateSopDto } from './dto/create-sop.dto';
import { UpdateSopDto } from './dto/update-sop.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { RolesGuard } from 'src/utils/authorization/roles.guard';
import { Roles } from 'src/utils/authorization/roles.decorator';
import { Role } from 'src/utils/authorization/role.enum';

@ApiTags('sop')
@Controller('sop')
export class SopController {
  constructor(private readonly sopService: SopService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SuperAdmin,Role.Admin)
  @ApiOperation({
    summary: 'Create a new SOP',
    description: 'Creates a new Standard Operating Procedure record.',
  })
  @ApiCreatedResponse({ description: 'The SOP has been successfully created.' })
  @ApiBody({
    type: CreateSopDto,
    description: 'The data for creating a new SOP.',
  })
  async create(@Body() createSopDto: CreateSopDto, @Req() req: any) {
    console.log(createSopDto);
    try {
      return await this.sopService.create(req.user, createSopDto);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create SOP due to an unexpected server issue.',
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all SOPs',
    description: 'Returns a list of all Standard Operating Procedures.',
  })
  @ApiOkResponse({ description: 'A list of SOPs.', isArray: true })
  @ApiQuery({
    name: 'jurisdiction',
    required: false,
    type: String,
    description: 'Filter by jurisdiction',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Search for SOPs by title using a partial match.',
  })
  async findAll(
    @Query('jurisdiction') jurisdiction?: string,
    @Query('title') title?: string,
    @Query('status') status?: string,
  ) {
    try {
      return await this.sopService.findAll(jurisdiction, title, status);
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve SOPs.');
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a single SOP',
    description: 'Returns a single SOP by its ID.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the SOP.', type: String })
  @ApiOkResponse({ description: 'The requested SOP.' })
  @ApiResponse({ status: 404, description: 'SOP not found.' })
  async findOne(@Param('id') id: string) {
    try {
      const sop = await this.sopService.findOne(id);
      if (!sop) {
        throw new NotFoundException(`SOP with ID "${id}" not found.`);
      }
      return sop;
    } catch (error) {
      // Re-throw if it's already an HTTP exception (e.g., NotFoundException)
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Handle generic errors
      throw new InternalServerErrorException('Failed to retrieve SOP.');
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an SOP',
    description: 'Updates an existing SOP record by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the SOP to update.',
    type: String,
  })
  @ApiBody({
    type: UpdateSopDto,
    description: 'The data for updating the SOP.',
  })
  @ApiOkResponse({ description: 'The SOP has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'SOP not found.' })
  async update(@Param('id') id: string, @Body() updateSopDto: UpdateSopDto) {
    try {
      const updatedSop = await this.sopService.update(id, updateSopDto);
      if (!updatedSop) {
        throw new NotFoundException(
          `SOP with ID "${id}" cannot be updated because it was not found.`,
        );
      }
      return updatedSop;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Example: Handle validation/input error
      // if (error.message.includes('Invalid data')) {
      //   throw new BadRequestException('Invalid update data provided.');
      // }
      throw new InternalServerErrorException('Failed to update SOP.');
    }
  }

  @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SuperAdmin,Role.Admin)
  @ApiOperation({
    summary: 'Delete an SOP',
    description: 'Deletes an SOP record by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the SOP to delete.',
    type: String,
  })
  @ApiOkResponse({ description: 'The SOP has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'SOP not found.' })
  async remove(@Param('id') id: string) {
    try {
      const removedSop = await this.sopService.remove(id);
      if (!removedSop) {
        // This check assumes your service returns null/undefined if the record didn't exist to delete
        throw new NotFoundException(`SOP with ID "${id}" not found.`);
      }
      return removedSop;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete SOP.');
    }
  }
}
