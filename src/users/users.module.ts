import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from 'src/schemas/schemas-users';
import { UsersController } from './users.controller';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { jwtConstants } from 'src/auth/constants';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/roles/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp-mail.outlook.com',
        secure: false,
        auth: {
          user: 'hadilayari@fsb.u-carthage.tn',
          pass: '26072000hH',
        },
        port: 587,
        tls: {
          ciphers: 'SSLv3',
        },
      },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
