import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/createuserdto';
import { LoginUserDto } from 'src/dto/logindto';
import { Users ,Role } from 'src/schemas/schemas-users';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Users.name) private UsersModel: Model<Users>,
        private jwtService: JwtService,
        private readonly mailService: MailerService
    ) {}

    async generatePassword(length: number = 8): Promise<{ plain: string, hash: string }> {
        const saltRounds = 10;
        const randomPassword = Math.random().toString(36).slice(-length);
        const hash = await bcrypt.hash(randomPassword, saltRounds);
        return { plain: randomPassword, hash };
    }

    async registerAdmin(createUserDto: CreateUserDto): Promise<any> {
        const existingUser = await this.UsersModel.findOne({ email: createUserDto.email });

        if (existingUser) {
            throw new BadRequestException('Your Email is already registered. Try to login.');
        }

        try {
            const { plain: randomPassword, hash } = await this.generatePassword(8); 
            const createdUser = new this.UsersModel({ ...createUserDto, pass: hash });
            await createdUser.save();
            
            let subject = 'AquaOptim Account';
            let message: string;

            if (createdUser.roles.includes(Role.SuperAdmin)) {
                message = `Welcome to Tech4IoT Complaints. Mr Super Admin, your email: ${createUserDto.email}, your password: ${randomPassword}`;
            } else if (createdUser.roles.includes(Role.Admin)) {
                subject = 'Welcome to Tech4IoT Complaints, Admin';
                message = `Welcome to Tech4IoT Complaints. Your email: ${createUserDto.email}, your password: ${randomPassword}`;
            } else {
                message = `Welcome to Tech4IoT Complaints. Your email: ${createUserDto.email}, your password: ${randomPassword}`;
            }

            await this.mailService.sendMail({
                from: 'Tech4IoT <hadilayari@fsb.u-carthage.tn>',
                to: createUserDto.email,
                subject,
                text: message,
            });
             console.log(message);
             
            return createdUser;
        } catch (error) {
            console.error('Error occurred during registration:', error);
            throw new BadRequestException('Error occurred during registration');
        }
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {
        try {
            const user = await this.UsersModel.findOne({ email: loginUserDto.email });
            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const isMatch = await bcrypt.compare(loginUserDto.pass, user.pass);
            if (!isMatch) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const payload = { id:user._id,email: user.email, name: user.name, lastname: user.lastname, roles: user.roles };
            return {
                accessToken: await this.jwtService.signAsync(payload),
            };
        } catch (error) {
            console.error('Error during login:', error);
            throw new UnauthorizedException('Failed to login. Please try again.');
        }
    }
}
