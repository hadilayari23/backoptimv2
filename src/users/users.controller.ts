import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dto/createuserdto';
import { Role, Users } from 'src/schemas/schemas-users';
import { Updateuserdto } from 'src/dto/updateuserdto';
import { Roles } from 'src/roles/roles.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Roles(Role.SuperAdmin)
    @Post(':iduser/add')
    async create(@Param('iduser') iduser: string, @Body() createuserdto: CreateUserDto, @Res() res): Promise<Users> {
        try {
            const createUser = await this.usersService.CreateUser(iduser, createuserdto);
            console.log(createUser);
            return res.status(HttpStatus.CREATED).json({ message: 'User created successfully', data: createUser });
        } catch (error) {
            return res.status(HttpStatus.NOT_ACCEPTABLE).json({ message: 'Try again!', error: error.message });
        }
    }
    @Roles(Role.SuperAdmin)
    @Get('allbyuser/:iduser')
    async getAllByUser(@Param('iduser') iduser: string, @Res() res): Promise<Users[]> {
        try {
            const existsUsers = await this.usersService.GetAllByuser(iduser);
            return res.status(HttpStatus.OK).json({ message: 'List of users', data: existsUsers });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Try again!', error: error.message });
        }
    }

    @Get('')
    async getAll(@Res() res): Promise<Users[]> {
        try {
            const existsUsers = await this.usersService.GetAll();
            return res.status(HttpStatus.OK).json({ message: 'List of users', data: existsUsers });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Try again!', error: error.message });
        }
    }
    @Roles(Role.SuperAdmin)
    @Get(':id')
    async getById(@Param('id') id: string, @Res() res): Promise<Users> {
        try {
            const existUser = await this.usersService.GetById(id);
            return res.status(HttpStatus.OK).json({ message: 'Data of user is:', data: existUser });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Try again!', error: error.message });
        }
    }
    @Roles(Role.SuperAdmin)
    @Put(':id')
    async update(@Body() updateuserdto: Updateuserdto, @Param('id') id: string, @Res() res): Promise<Users> {
        try {
            const updatedUser = await this.usersService.UpdateUsers(updateuserdto, id);
            console.log(updatedUser);
            return res.status(HttpStatus.OK).json({ message: 'User updated successfully :)', data: updatedUser });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Try again', error: error.message });
        }
    }
    @Roles(Role.SuperAdmin)
    @Delete(':iduser/:id')
    async delete(@Param('iduser') iduser: string, @Param('id') id: string, @Res() res): Promise<Users> {
        try {
            // Récupérez l'utilisateur à supprimer
            const userToDelete = await this.usersService.GetById(id);
            
            // Vérifiez si l'utilisateur est un super administrateur
            if (userToDelete.roles === Role.SuperAdmin) {
                return res.status(HttpStatus.FORBIDDEN).json({ message: 'You cannot delete a Super Admin' });
            }
    
            // Supprimez l'utilisateur s'il n'est pas un super administrateur
            const deletedUser = await this.usersService.delete(id, iduser);
            return res.status(HttpStatus.OK).json({ message: 'User deleted successfully :)', data: deletedUser });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Try again', error: error.message });
        }
    }
    
}
