import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { Model } from 'mongoose';

import { RegisterUserDto } from './dto';
import { User, UserType } from './schemas';
import { TokenPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserType>,
    private jwtService: JwtService,
  ) {}

  async login(user: UserType) {
    const payload: TokenPayload = { user_id: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const existingUser = await this.userModel.findOne({
      email: { $eq: registerUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const userData: User = {
      ...registerUserDto,
      password: await hash(registerUserDto.password, await genSalt()),
    };
    const newUser = new this.userModel(userData);
    return newUser.save();
  }
}
