import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TickerService } from './ticker.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('ticker')
export class TickerController {
  constructor(private readonly tickerService: TickerService) {}

  @Get()
  findActive() {
    return this.tickerService.findActive();
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  findAllAdmin() {
    return this.tickerService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tickerService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  create(@Body() data: any) {
    return this.tickerService.create(data);
  }

  @Put('reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  reorder(@Body() body: { items: { id: string; order: number }[] }) {
    return this.tickerService.reorder(body.items || []);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  update(@Param('id') id: string, @Body() data: any) {
    return this.tickerService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  delete(@Param('id') id: string) {
    return this.tickerService.delete(id);
  }

  @Post('admin/seed-defaults')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  seedDefaults() {
    return this.tickerService.seedDefaults();
  }
}
