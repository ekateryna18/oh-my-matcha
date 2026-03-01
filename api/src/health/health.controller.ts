import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      project: 'Oh My Matcha API',
      timestamp: new Date().toISOString(),
    };
  }
}