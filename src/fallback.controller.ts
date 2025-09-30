import { All, Controller, Header, HttpCode } from '@nestjs/common';
import { NOT_FOUND_HTML } from './views/staticPages';

@Controller()
export class FallbackController {
  @All('*')
  @HttpCode(404)
  @Header('Content-Type', 'text/html; charset=utf-8')
  notFound(): string {
    return NOT_FOUND_HTML;
  }
}
