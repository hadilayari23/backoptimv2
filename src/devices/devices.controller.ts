import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Res
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { Devices } from 'src/schemas/schemas-devices';
import { CreateDeviceDto } from 'src/dto/createdevicedto';
import { Updatdevicedto } from 'src/dto/updatedevicedto';
import { ToggleDto } from 'src/dto/toggleDto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/schemas/schemas-users';
import { Response } from 'express';

@Controller('devices')
export class DevicesController {
  constructor(private readonly deviceService: DevicesService) {}
   // Run Python Script
   @Get('run')
   async runPythonScript(@Res() res: Response): Promise<void> {
     try {
       const output = await this.deviceService.runPythonScript();
       console.log('Python script output:', output);  // Afficher la sortie dans la console
       res.status(HttpStatus.OK).json({ message: 'Python script executed successfully', output: output });
     } catch (error) {
       console.error('Error executing Python script:', error.message);  // Afficher l'erreur dans la console
       res.status(HttpStatus.BAD_REQUEST).json({ message: 'Error executing Python script', error: error.message });
     }
   }
    // Toggle Device
  @Post('toggle')
  async toggleDevice(@Body() toggleDto: ToggleDto, @Res() res: Response): Promise<void> {
    try {
      await this.deviceService.toggleDevice(toggleDto.deveui, toggleDto.onoff);
      res.status(HttpStatus.OK).json({ message: 'Device state updated successfully.' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error updating device state.', error: error.message });
    }
  }
  // Create Device
  @Roles(Role.Admin)
  @Post(':userId/add')
  async create(
    @Param('userId') userId: string,
    @Body() createDeviceDto: CreateDeviceDto,
    @Res() res: Response
  ): Promise<void> {
    try {
      const createdDevice = await this.deviceService.createDevice(userId, createDeviceDto);
      res.status(HttpStatus.CREATED).json({ message: 'Device created successfully', data: createdDevice });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Error', error: error.message });
    }
  }

  // Get All Devices
  @Get(':userId/all')
  async getAll(
    @Param('userId') userId: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      const existingDevices = await this.deviceService.getAllDevices(userId);
      res.status(HttpStatus.OK).json({ message: 'Devices retrieved successfully', data: existingDevices });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Error', error: error.message });
    }
  }

  // Get Device by ID
  @Get(':id')
  async getById(
    @Param('id') id: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      const existingDevice = await this.deviceService.GetByIdDevices(id);
      res.status(HttpStatus.OK).json({ message: 'Success', data: existingDevice });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Error', error: error.message });
    }
  }

  // Update Device by ID
  @Roles(Role.Admin)
  @Put(':id')
  async updateById(
    @Body() updateDeviceDto: Updatdevicedto,
    @Param('id') id: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      const updatedDevice = await this.deviceService.UpdateDevices(updateDeviceDto, id);
      res.status(HttpStatus.OK).json({ message: 'Success!', data: updatedDevice });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Error', error: error.message });
    }
  }

  // Delete Device by ID
  @Roles(Role.Admin)
  @Delete(':userId/:id')
  async deleteById(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      const deletedDevice = await this.deviceService.DeleteDevices(id, userId);
      res.status(HttpStatus.OK).json({ message: 'Success!', data: deletedDevice });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Error', error: error.message });
    }
  }



 
}
