import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Devices, DevicesSchemas } from 'src/schemas/schemas-devices';
import { Users, UsersSchema } from 'src/schemas/schemas-users';
import { IoT, SensorData } from 'src/schemas/sensordata';

@Module({
  imports: [MongooseModule.forFeature([{ name: Devices.name, schema: DevicesSchemas}]),MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema}]),MongooseModule.forFeature([{ name: IoT.name, schema: SensorData}])],
  controllers: [DevicesController],
  providers: [DevicesService]
})
export class DevicesModule {}
