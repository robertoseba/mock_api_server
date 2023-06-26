import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  private readonly heapThreshold = 512 * 1024 * 1024; // 512MB

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('melhorenvio', 'https://melhorenvio.com.br'),
      () => this.memory.checkHeap('memory_heap', this.heapThreshold),
    ]);
  }
}
