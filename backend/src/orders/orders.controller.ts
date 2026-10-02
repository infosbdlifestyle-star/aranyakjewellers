import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createOrder(
    @Request() req, 
    @Body() body: { shippingAddress: any; items?: any[]; totalAmount?: number }
  ) {
    return this.ordersService.createOrder(
      req.user.userId, 
      body.shippingAddress, 
      body.items, 
      body.totalAmount
    );
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyOrders(@Request() req) {
    return this.ordersService.getMyOrders(req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  getAllOrders(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
  ) {
    return this.ordersService.getAllOrders(
      status,
      search,
      page ? Number(page) : 1,
    );
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateOrderStatus(id, body.status);
  }

  @Put(':id/mark-paid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  markPaid(@Param('id') id: string) {
    return this.ordersService.markAsPaid(id);
  }
}
