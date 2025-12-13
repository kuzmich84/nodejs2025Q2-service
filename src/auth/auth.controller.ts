import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignupDto) {
    if (
      !dto.login ||
      !dto.password ||
      typeof dto.login !== 'string' ||
      typeof dto.password !== 'string'
    ) {
      throw new BadRequestException(
        'Login and password are required and must be strings',
      );
    }
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    if (
      !dto.login ||
      !dto.password ||
      typeof dto.login !== 'string' ||
      typeof dto.password !== 'string'
    ) {
      throw new BadRequestException(
        'Login and password are required and must be strings',
      );
    }
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto) {
    if (!dto.refreshToken || typeof dto.refreshToken !== 'string') {
      throw new BadRequestException(
        'Refresh token is required and must be string',
      );
    }
    return this.authService.refresh(dto);
  }
}
