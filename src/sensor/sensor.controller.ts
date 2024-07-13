import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { IoT } from 'src/schemas/sensordata';

@Controller('sensors')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get()
  async findAll(): Promise<IoT[]> {
    return this.sensorService.findAll();
  }

  @Get(':DevEUI')
  async findByDevEUI(@Param('DevEUI') DevEUI: string): Promise<IoT[]> {
    try {
      return await this.sensorService.findByDevEUI(DevEUI);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}

