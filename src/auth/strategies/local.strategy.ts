import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { compare } from 'bcrypt';
import { Model } from 'mongoose';
import { Strategy } from 'passport-local';

import { User, UserType } from '../schemas';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<UserType>) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.userModel.findOne({
      email: { $eq: email },
    });

    if (!user) {
      throw new UnauthorizedException('User with this email was not found');
    }

    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Incorrect password');
    }

    return user;
  }
}
