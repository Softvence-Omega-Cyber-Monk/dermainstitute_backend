import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Header } from '@nestjs/common';
import { WELCOME_HTML } from './views/staticPages';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  getHello(): string {
    return WELCOME_HTML;
  }
}
