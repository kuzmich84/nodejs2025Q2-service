import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import type { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.create({
      login: dto.login,
      password: hashed,
    });

    return { message: 'User created successfully' };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByLogin(dto.login);
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new ForbiddenException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.login);
    return tokens;
  }

  async refresh(dto: RefreshDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const tokens = await this.generateTokens(payload.userId, payload.login);
      return tokens;
    } catch (error) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }

  private generateTokens(userId: string, login: string) {
    const payload = { userId, login };

    const accessExpiresIn = (process.env.JWT_ACCESS_EXPIRES ||
      '15m') as StringValue;
    const refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES ||
      '7d') as StringValue;

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET!,
      expiresIn: accessExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET!,
      expiresIn: refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }
}
