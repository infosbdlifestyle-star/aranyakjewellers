import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
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

  // --- Profile & Address Management ---

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req,
    @Body() body: { name?: string; mobile?: string; currentPassword?: string; newPassword?: string },
  ) {
    return this.authService.updateProfile(req.user.userId, body);
  }

  @Post('addresses')
  @UseGuards(JwtAuthGuard)
  async addAddress(
    @Request() req,
    @Body() body: { fullName: string; street: string; city: string; state: string; zip: string; phone: string; isDefault?: boolean },
  ) {
    return this.authService.addAddress(req.user.userId, body);
  }

  @Delete('addresses/:id')
  @UseGuards(JwtAuthGuard)
  async deleteAddress(@Request() req, @Param('id') id: string) {
    return this.authService.deleteAddress(req.user.userId, id);
  }

  @Put('addresses/:id/default')
  @UseGuards(JwtAuthGuard)
  async setDefaultAddress(@Request() req, @Param('id') id: string) {
    return this.authService.setDefaultAddress(req.user.userId, id);
  }

  @Get('ping')
  async ping() {
    return { message: 'pong', version: '1.0', brand: 'Aranyak Jewellers' };
  }
}
