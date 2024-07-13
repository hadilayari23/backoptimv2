import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SensorService } from './sensor.service';
import { SensorController } from './sensor.controller';
import { IoT, SensorData } from 'src/schemas/sensordata';

@Module({
  imports: [MongooseModule.forFeature([{ name: IoT.name, schema: SensorData}])],
  controllers: [SensorController],
  providers: [SensorService],
})
export class SensorModule {}
