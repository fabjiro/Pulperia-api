import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateProfileDto } from '../profile/profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('refreshToken')
  refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
  @Post('register')
  register(@Body() createProfiledto: CreateProfileDto) {
    return this.authService.create(createProfiledto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Request() req) {
    return this.authService.me(req.user.id);
  }
}
