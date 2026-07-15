import {
  Controller,
  Post,
  Get,
  Body,
  UnauthorizedException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() req: { email: string; password: string; totpCode?: string }) {
    const user = await this.authService.validateUser(req.email, req.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user, req.totpCode);
  }

  @Post('register')
  async register(@Body() body: any) {
    const user = await this.authService.register(body);
    return this.authService.login(user);
  }

  // --- TOTP Endpoints ---

  @Post('totp/generate')
  @UseGuards(JwtAuthGuard)
  async generateTotp(@Request() req) {
    return this.authService.generateTotpSecret(req.user.sub, req.user.email);
  }

  @Post('totp/enable')
  @UseGuards(JwtAuthGuard)
  async enableTotp(@Request() req, @Body() body: { token: string }) {
    return this.authService.enableTotp(req.user.sub, body.token);
  }
  
  @Post('totp/disable')
  @UseGuards(JwtAuthGuard)
  async disableTotp(@Request() req) {
    return this.authService.disableTotp(req.user.sub);
  }

  // --- Password Reset Endpoints ---

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }

  // --- Profile ---

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return req.user;
  }

  @Get('ping')
  async ping() {
    return { message: 'pong', version: '1.0', brand: 'Aranyak Jewellers' };
  }
}
