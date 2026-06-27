import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSettingDto } from './dto/create-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.siteSetting.findMany();
  }

  async findByKey(key: string) {
    return this.prisma.siteSetting.findUnique({ where: { key } });
  }

  async upsert(createSettingDto: CreateSettingDto) {
    return this.prisma.siteSetting.upsert({
      where: { key: createSettingDto.key },
      update: { value: createSettingDto.value },
      create: { key: createSettingDto.key, value: createSettingDto.value },
    });
  }

  async upsertMany(settings: CreateSettingDto[]) {
    const results = [];
    for (const setting of settings) {
      results.push(await this.upsert(setting));
    }
    return results;
  }
}
