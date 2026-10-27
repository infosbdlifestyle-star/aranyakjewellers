import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req: any, @Res() res: any) {
    const acceptHeader = req.headers['accept'] || '';
    if (acceptHeader.includes('text/html') && !req.query.json) {
      res.setHeader('Content-Type', 'text/html');
      return res.send(this.appService.getDashboardHtml());
    }
    return res.json(this.appService.getStatusJson());
  }
}
