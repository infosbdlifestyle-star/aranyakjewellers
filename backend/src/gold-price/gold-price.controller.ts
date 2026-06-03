import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { GoldPriceService } from './gold-price.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('gold-price')
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
}
