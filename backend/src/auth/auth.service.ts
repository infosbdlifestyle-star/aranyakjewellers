import { Injectable, UnauthorizedException, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { authenticator } = require('otplib');
import * as qrcode from 'qrcode';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const normalizedEmail = email.toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.password) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, totpCode?: string) {
    // If TOTP is enabled, verify it before returning the token
    if (user.totpEnabled) {
      if (!totpCode) {
        return { requiresTotp: true, userId: user.id };
      }
      
      const isValid = authenticator.verify({ token: totpCode, secret: user.totpSecret });
      if (!isValid) {
        throw new UnauthorizedException('Invalid TOTP code');
      }
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        totpEnabled: user.totpEnabled,
      },
    };
  }

  async register(data: any) {
    const { name, password, email, mobile } = data;
    const normalizedEmail = email.toLowerCase();

    const existingEmail = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingEmail) {
      throw new UnauthorizedException('Email already in use.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        mobile: mobile || null,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return newUser;
  }

  // --- TOTP (2FA) Setup ---

  async generateTotpSecret(userId: string, email: string) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(email, 'Aranyak Jewellers Admin', secret);
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { totpSecret: secret },
    });

    const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);
    return { qrCode: qrCodeDataUrl, secret };
  }

  async enableTotp(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.totpSecret) throw new NotFoundException('User or TOTP secret not found');

    const isValid = authenticator.verify({ token, secret: user.totpSecret });
    if (!isValid) {
      throw new UnauthorizedException('Invalid TOTP code');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { totpEnabled: true },
    });

    return { success: true, message: 'TOTP enabled successfully' };
  }
  
  async disableTotp(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { totpEnabled: false, totpSecret: null },
    });
    return { success: true };
  }

  // --- Forgot & Reset Password ---

  async forgotPassword(email: string) {
    const normalizedEmail = email.toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    
    // We return success even if user not found to prevent email enumeration
    if (!user) return { success: true, message: 'If email exists, a reset link was sent.' };

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    // In a real app, this domain would be dynamic or from env.
    const resetUrl = `${process.env.FRONTEND_URL || 'https://aranyakjewellers.vercel.app'}/reset-password?token=${resetToken}`;
    
    await this.mailService.sendPasswordResetEmail(user.email!, resetUrl);

    return { success: true, message: 'If email exists, a reset link was sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { success: true, message: 'Password reset successfully' };
  }

  // --- Profile & Address Management ---

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        totpEnabled: true,
        createdAt: true,
        addresses: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(
    userId: string,
    data: { name?: string; mobile?: string; currentPassword?: string; newPassword?: string },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const updateData: any = {};
    if (data.name) updateData.name = data.name.trim();
    if (data.mobile !== undefined) updateData.mobile = data.mobile ? data.mobile.trim() : null;

    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new BadRequestException('Current password is required to set a new password');
      }
      const isMatch = await bcrypt.compare(data.currentPassword, user.password || '');
      if (!isMatch) {
        throw new BadRequestException('Current password does not match');
      }
      updateData.password = await bcrypt.hash(data.newPassword, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        totpEnabled: true,
        createdAt: true,
        addresses: true,
      },
    });

    return updated;
  }

  async addAddress(
    userId: string,
    address: { fullName: string; street: string; city: string; state: string; zip: string; phone: string; isDefault?: boolean },
  ) {
    if (address.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        userId,
        fullName: address.fullName.trim(),
        street: address.street.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        zip: address.zip.trim(),
        phone: address.phone.trim(),
        isDefault: address.isDefault ?? false,
      },
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const existing = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!existing) throw new NotFoundException('Address not found');

    await this.prisma.address.delete({
      where: { id: addressId },
    });
    return { success: true };
  }

  async setDefaultAddress(userId: string, addressId: string) {
    const existing = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!existing) throw new NotFoundException('Address not found');

    await this.prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    return this.prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}
