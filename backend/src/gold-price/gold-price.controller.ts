import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { GoldPriceService } from './gold-price.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller(['gold-price', 'gold-rates'])
export class GoldPriceController {
  constructor(private readonly goldPriceService: GoldPriceService) {}

  @Get()
  findAll() {
    return this.goldPriceService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  upsert(@Body() body: { purity: number; pricePer10g: number }) {
    return this.goldPriceService.upsert(body.purity, body.pricePer10g);
  }

  @Put(':purity')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  updateByParam(@Param('purity') purity: string, @Body() body: { pricePer10g: number }) {
    return this.goldPriceService.upsert(Number(purity), body.pricePer10g);
  }

  @Post('reset')
  async reset() {
    await this.goldPriceService.upsert(24, 79000);
    await this.goldPriceService.upsert(22, 72500);
    await this.goldPriceService.upsert(18, 59300);
    await this.goldPriceService.upsert(9, 29650);
    return this.goldPriceService.findAll();
  }
}
