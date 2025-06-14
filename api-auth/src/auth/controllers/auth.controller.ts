import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

@Post('register')
async register(@Body() registerDto: RegisterDto) {
  const user = await this.authService.register(registerDto);
  return { message: 'User registered', userId: user.id };
}

 @UseGuards(LocalAuthGuard)
@Post('login')
async login(@Request() req) {
  return this.authService.login(req.user);
}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
