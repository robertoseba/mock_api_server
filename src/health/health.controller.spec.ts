import { HttpModule } from '@nestjs/axios';
import { ServiceUnavailableException } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicatorResult,
  HealthIndicatorStatus,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TerminusModule,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let httpIndicator: FakeHttpHealthIndicator;
  let memoryIndicator: FakeMemoryHealthIndicator;

  beforeEach(async () => {
    httpIndicator = new FakeHttpHealthIndicator();
    memoryIndicator = new FakeMemoryHealthIndicator();

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, TerminusModule],
      controllers: [HealthController],
    })
      .overrideProvider(HttpHealthIndicator)
      .useValue(httpIndicator)
      .overrideProvider(MemoryHealthIndicator)
      .useValue(memoryIndicator)
      .compile();

    controller = module.get<HealthController>(HealthController);
  });

  describe('when services are up', () => {
    it('returns status ok', async () => {
      const { status } = await controller.check();
      expect(status).toBe('ok');
    });

    it('pings melhorenvio.com.br', async () => {
      await controller.check();
      expect(httpIndicator.pingedUrls).toContain('https://melhorenvio.com.br');
    });

    it('reports melhorenvio status', async () => {
      const { info } = await controller.check();
      expect(info.melhorenvio).toEqual({ status: 'up' });
    });

    it('reports memory status', async () => {
      const { info } = await controller.check();
      expect(info.memory_heap).toEqual({ status: 'up' });
    });
  });

  describe('when melhor envio ping fails', () => {
    it('reports the failure', async () => {
      httpIndicator.setNextStatus('down');

      await expect(() => controller.check()).rejects.toThrowError(
        ServiceUnavailableException,
      );
    });
  });

  describe('when memory check fails', () => {
    it('reports the failure', async () => {
      memoryIndicator.setNextStatus('down');

      await expect(() => controller.check()).rejects.toThrowError(
        ServiceUnavailableException,
      );
    });
  });
});

class FakeHttpHealthIndicator {
  pingedUrls: string[] = [];
  nextStatus: HealthIndicatorStatus = 'up';

  setNextStatus(status: HealthIndicatorStatus) {
    this.nextStatus = status;
  }

  pingCheck(key: string, url: string): Promise<HealthIndicatorResult> {
    this.pingedUrls.push(url);

    if (this.nextStatus === 'down') {
      return Promise.reject(
        new HealthCheckError('failed for some reason', 'for no cause at all'),
      );
    }

    return Promise.resolve({ [key]: { status: this.nextStatus } });
  }
}

class FakeMemoryHealthIndicator {
  nextStatus: HealthIndicatorStatus = 'up';

  setNextStatus(status: HealthIndicatorStatus) {
    this.nextStatus = status;
  }

  checkHeap(key: string): Promise<HealthIndicatorResult> {
    if (this.nextStatus === 'down') {
      return Promise.reject(
        new HealthCheckError('failed for some reason', 'for no cause at all'),
      );
    }

    return Promise.resolve({ [key]: { status: 'up' } });
  }
}
