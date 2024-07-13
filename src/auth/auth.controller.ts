import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Users } from 'src/schemas/schemas-users';
import { LoginUserDto } from 'src/dto/logindto';
import { CreateUserDto } from 'src/dto/createuserdto';
import { AuthGuard } from './auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';



@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post("signup")
    async signUp(@Body() createUserDto: CreateUserDto, @Res() res): Promise<any> {
      try {
        const createdUser = await this.authService.registerAdmin(createUserDto)
        return res.status(HttpStatus.CREATED).json({ message: "User created successfully", data: createdUser })
      } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "Failed to create. Please try again!", error: error })
      }
    }

    @Post("signin")
    async signIn(@Body() loginUserDto: LoginUserDto, @Res() res): Promise<any> {
        try {
            const user = await this.authService.login(loginUserDto)
            return res.status(HttpStatus.OK).json({ message: "User logged in successfully", data: user })

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Failed to login. Please try again!", error: error })
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
      return req.user;
    }
}
