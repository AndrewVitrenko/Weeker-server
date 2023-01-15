import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { jwtConstants } from '../constants';
import { TokenPayload } from '../types';
import { User, UserType } from '../schemas';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<UserType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.userModel.findById(payload.user_id);

    if (!user) {
      throw new UnauthorizedException('User with this id was not found');
    }

    return {
      userId: payload.user_id,
    };
  }
}
