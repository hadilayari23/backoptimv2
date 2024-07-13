import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

import { DevicesModule } from './devices/devices.module';
import { SensorModule } from './sensor/sensor.module';
import { PythonService } from './python/python.service';

@Module({
  imports: [UsersModule , MongooseModule.forRoot("mongodb+srv://hadil:hadil@cluster0.k8nl53t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"), DevicesModule, SensorModule],
  providers: [PythonService],
  exports: [PythonService],
  controllers: [],
})
export class AppModule {
  constructor(private readonly pythonService: PythonService) {}

  async onApplicationBootstrap() {
    try {
      this.pythonService.runPythonScript()
        .then((result) => {
          console.log('Python script result:', result);
        })
        .catch((error) => {
          console.error('Error running Python script:', error);
        });
    } catch (error) {
      console.error('Error in onApplicationBootstrap:', error);
    }
  }
}
