import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/createuserdto';
import { Updateuserdto } from 'src/dto/updateuserdto';
import { Role, Users } from 'src/schemas/schemas-users';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(Users.name) private usersModel: Model<Users>,
        private readonly mailService: MailerService,
      ) {}
//######################################create##########################################################################################
async generatePassword(length: number = 8): Promise<{ plain: string, hash: string }> {
    const saltRounds = 10;
    const randomPassword = Math.random().toString(36).slice(-length);
    const hash = await bcrypt.hash(randomPassword, saltRounds);
    return { plain: randomPassword, hash };
}

async CreateUser(userId: string, createUserDto: CreateUserDto): Promise<Users> {
    const existingUser = await this.usersModel.findOne({ email: createUserDto.email });

    if (existingUser) {
        throw new BadRequestException('Your email is already registered. Try to login.');
    }

    try {
        const user = await this.usersModel.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const { plain: randomPassword, hash } = await this.generatePassword(8);
        const newUser = new this.usersModel({ ...createUserDto, pass: hash ,roles:'admin'});
        user.users.push(newUser._id);  // Assuming `users` is an array of user IDs
        await user.save();

        await newUser.save();

        let subject = 'AquaOptim Account';
        let message: string;
       if (newUser.roles.includes(Role.Admin)) {
            subject = 'Welcome to Tech4IoT Complaints, Admin';
            message = `Welcome to Tech4IoT Complaints. Your email: ${createUserDto.email}, your password: ${randomPassword}`;
        } 
        await this.mailService.sendMail({
            from: 'Tech4IoT <hadilayari@fsb.u-carthage.tn>',
            to: createUserDto.email,
            subject,
            text: message,
        });

        console.log(message);

        return newUser;
    } catch (error) {
        console.error('Error occurred during registration:', error);
        if (error.code === 11000) {  // MongoDB duplicate key error
            throw new BadRequestException('Email already exists');
        }
        throw new BadRequestException('Error occurred during registration');
    }
}


//######################################Update##########################################################################################
async UpdateUsers (UpdateUserdto:Updateuserdto , id :String):Promise<Users>{
    try {
        if (UpdateUserdto.pass) {
            const salt =10
            UpdateUserdto.pass= await bcrypt.hash( UpdateUserdto.pass,salt)
        }
        const updateduser= await this.usersModel.findByIdAndUpdate(id,UpdateUserdto)
        if (updateduser) {
            return updateduser
        }
        throw new NotFoundException('User not found');

    } catch (error) {
        if (error.code === 11000) {  // MongoDB duplicate key error
            throw new BadRequestException('Email already exists');
        }
        throw error;
    }
    }
//######################################GetALL##########################################################################################
async GetAllByuser(userId:string):Promise<Users[]>{
try {
    const user = await this.usersModel.findById(userId).exec();

   const existsusers=await this.usersModel.find({_id :{$in:user.users}})
   console.log(`Devices found: ${existsusers.length}`);
   if (existsusers.length === 0) {
       console.log('No devices found for this user.');
   }
   return existsusers
} catch (error) {
    throw error
}
}
async GetAll():Promise<Users[]>{
    try {
       
       const existsusers=await this.usersModel.find()
       return existsusers
    } catch (error) {
        throw error
    }
    }
//######################################GetById##########################################################################################
async GetById(id:String):Promise<Users>{
    try {
       const existsusers=await this.usersModel.findById(id)
       if (existsusers) {
        return existsusers
    }
       throw new NotFoundException
    } catch (error) {
        throw error
    }
    }
//######################################Delete#########################################################################################
async delete(id: string, iduser: string): Promise<Users> {
    try {
      // Find the user by iduser
      const userToDelete = await this.usersModel.findById(iduser);
      if (!userToDelete) {
        throw new NotFoundException("User to delete not found");
      }

      // Find the user by id
      const user = await this.usersModel.findByIdAndDelete(id);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      // Remove the id from the user's list of users
      userToDelete.users.pull(id);
      await userToDelete.save();

      return user;
    } catch (error) {
      throw error;
    }
  }
}


