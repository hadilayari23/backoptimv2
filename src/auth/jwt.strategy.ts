import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { PayloadInterface } from 'src/interfaces/interfacepayload';
import { Users } from 'src/schemas/schemas-users';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: PayloadInterface) {
    const user = await this.usersModel.findOne({ email: payload.email }).exec();
    console.log(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    const { pass, ...result } = user.toObject(); // assuming the password field is named 'password'
    return {
      ...result,
      name: payload.name,
      lastname: payload.lastname,
      roles: payload.roles,
    };
  }
}
