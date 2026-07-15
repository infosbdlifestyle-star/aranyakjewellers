import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { MailService } from '../mail/mail.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        mobile: true,
        totpEnabled: true,
        createdAt: true,
      },
    });
  }

  async create(data: { name: string; email: string; role: Role; mobile?: string }) {
    const normalizedEmail = data.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    // Generate random 8-char password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: normalizedEmail,
        role: data.role,
        mobile: data.mobile || null,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    // Send welcome email with temp password
    await this.mailService.sendWelcomeEmail(user.email, user.name, tempPassword);

    return user;
  }

  async update(id: string, data: { name?: string; email?: string; role?: Role; mobile?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (data.email) {
      const normalizedEmail = data.email.toLowerCase();
      if (normalizedEmail !== user.email) {
        const existing = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (existing) throw new ConflictException('Email already in use');
        data.email = normalizedEmail;
      }
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        mobile: true,
        totpEnabled: true,
      }
    });
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    
    // Protect the master admin
    if (user.role === 'SUPER_ADMIN' && user.email === 'admin@aranyak.com') {
      throw new ConflictException('Cannot delete master admin account');
    }

    return this.prisma.user.delete({ where: { id } });
  }
}
