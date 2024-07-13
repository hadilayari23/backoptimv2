import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { exec, spawn } from 'child_process';
import { Model, Types } from 'mongoose';
import { CreateDeviceDto } from 'src/dto/createdevicedto';
import { DevicesDto } from 'src/dto/devicedto';
import { Updatdevicedto } from 'src/dto/updatedevicedto';
import { Devices } from 'src/schemas/schemas-devices';
import { Users } from 'src/schemas/schemas-users';
import { IoT } from 'src/schemas/sensordata';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Devices.name) private devicesModel: Model<Devices>,
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
    @InjectModel(IoT.name) private readonly iotModel: Model<IoT>,
  ) {}

  // Create Device
  async createDevice(userId: string, devicesDto: CreateDeviceDto): Promise<Devices> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const createdDevice = new this.devicesModel(devicesDto);
    await createdDevice.save();

    user.devices.push(createdDevice._id);
    await user.save();

       // Populate IoT data
       const iotData = await this.iotModel.find({ DevEUI: createdDevice.deveui }).exec() as IoT[];
       createdDevice.iotData = iotData.map(data => data._id as Types.ObjectId);
       await createdDevice.save();

    return createdDevice;
  }


  // Get All Devices
  async getAllDevices(userId: string): Promise<Devices[]> {
    try {
      console.log(`Retrieving devices for userId: ${userId}`);
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException(`User not found for userId: ${userId}`);
      }
      const devices = await this.devicesModel.find({
        _id: { $in: user.devices },
      }).exec();
      console.log(`Devices found: ${devices.length}`);
      if (devices.length === 0) {
        console.log('No devices found for this user.');
      }
      return devices;
    } catch (error) {
      console.error(`Error retrieving devices: ${error.message}`);
      throw new InternalServerErrorException(`Unable to retrieve devices for user ${userId}: ${error.message}`);
    }
  }

  // Get Device by ID
  async GetByIdDevices(id: string): Promise<Devices> {
    try {
      const existDevices = await this.devicesModel.findById(id).exec();
      if (existDevices) {
        return existDevices;
      }
      throw new NotFoundException("Device not found");
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async UpdateDevices(Updatedevice: Updatdevicedto, id: string): Promise<Devices> {
    try {
      const updatedDevice = await this.devicesModel.findByIdAndUpdate(id, Updatedevice, { new: true }).exec();
      if (updatedDevice) {
        return updatedDevice;
      }
      throw new NotFoundException("Device not found");
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async DeleteDevices(id: string, iduser: string): Promise<Devices> {
    try {
      const user = await this.userModel.findById(iduser);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      const deletedDevice = await this.devicesModel.findByIdAndDelete(id);
      if (!deletedDevice) {
        throw new NotFoundException("Device not found");
      }

      user.devices.pull(id);
      await user.save();

      return deletedDevice;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  runPythonScript(): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = exec('python3 ./src/python/downloadPython.py', (error, stdout, stderr) => {
        if (error) {
          console.error('Error:', error);  // Afficher l'erreur dans la console
          reject(error);
        } else {
          console.log('Stdout:', stdout);  // Afficher la sortie standard dans la console
          console.log('Stderr:', stderr);  // Afficher la sortie d'erreur dans la console
          resolve(stdout || stderr);
        }
      });

      process.stdout.on('data', (data) => {
        console.log('Python script stdout:', data);  // Afficher la sortie standard en temps réel dans la console
      });

      process.stderr.on('data', (data) => {
        console.error('Python script stderr:', data);  // Afficher la sortie d'erreur en temps réel dans la console
      });
    });
  }

  async toggleDevice(deveui: string, onoff: string): Promise<void> {
    await this.devicesModel.updateOne({ deveui: deveui }, { onoff: onoff }).exec();
  }
}
