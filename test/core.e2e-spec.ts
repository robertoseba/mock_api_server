import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from '../src/application/core/core.module';
import { ProcessRouteAction } from '../src/application/core/use_cases/process_route_action';

const testConfig = () => ({
  MOCK_FILE: './test/fixtures/mock-test-routes.json',
});

jest.mock('axios', () => ({
  default: () => {
    return {
      response: {
        status: 200,
      },
    };
  },
}));

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('Core (e2e)', () => {
  let app: INestApplication;

  let routeAction: ProcessRouteAction;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [testConfig],
        }),
        CoreModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    routeAction = moduleFixture.get<ProcessRouteAction>(ProcessRouteAction);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Executing mock routes', () => {
    it('/hello (GET)', async () => {
      await request(app.getHttpServer())
        .get('/hello')
        .expect(200)
        .expect({ response: 'world' });
    });

    it('/hello (POST) with callback', async () => {
      const spyProcessCallback = jest.spyOn(
        routeAction as any,
        'processCallback',
      );

      await request(app.getHttpServer())
        .post('/hello')
        .send({ id: 23 })
        .expect(201)
        .expect({ response: 23 });

      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2000);

      jest.runAllTimers();
      expect(spyProcessCallback).toHaveBeenCalledWith(
        'hello',
        {
          delay_ms: 2000,
          method: 'GET',
          payload: { id: '<id>' },
          url: 'http://localhost:5000',
        },
        { id: 23 },
      );
    });
  });
});
