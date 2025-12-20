import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './jwt.guard';

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

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto);
  }
}
