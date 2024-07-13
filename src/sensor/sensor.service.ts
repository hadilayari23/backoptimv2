import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IoT } from 'src/schemas/sensordata';

@Injectable()
export class SensorService {
  constructor(@InjectModel(IoT.name) private sensorModel: Model<IoT>) {}

  async findAll(): Promise<IoT[]> {
    return this.sensorModel.find().exec();
  }

  async findByDevEUI(DevEUI: string): Promise<IoT[]> {
    const sensorData = await this.sensorModel.find({ DevEUI }).exec();
    if (!sensorData || sensorData.length === 0) {
      throw new NotFoundException(`Sensor data not found for DevEUI: ${DevEUI}`);
    }
    return sensorData;
  }
}
