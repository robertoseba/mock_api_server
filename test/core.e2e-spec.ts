import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from '../src/core/core.module';
import { RouteService } from '../src/core/service/route.service';
import { RouteRepository } from '../src/core/repository/routes.repository';

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

  let routeService: RouteService;
  let routeRepository: RouteRepository;

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

    routeService = moduleFixture.get<RouteService>(RouteService);
    routeRepository = moduleFixture.get<RouteRepository>(RouteRepository);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Config', () => {
    describe('creating new route', () => {
      it('404 if route doesnt exist', async () => {
        await request(app.getHttpServer()).get('/config/new_route').expect(404);
        expect(routeRepository.getRoute('new_route')).toBeNull();
      });

      it('creates new route', async () => {
        const newRouteData = {
          GET: {
            response_status: 200,
            response_data: {
              response: '<id>',
            },
          },
        };

        await request(app.getHttpServer())
          .post('/config/new_route')
          .send(newRouteData)
          .expect(201)
          .expect(newRouteData);

        expect(routeRepository.getRoute('new_route')).toEqual(newRouteData);
      });
    });
  });

  describe('Preloaded routes from json file', () => {
    describe('Config mocked routes', () => {
      it('retrieve info from registered mocked route)', async () => {
        await request(app.getHttpServer())
          .get('/config/hello')
          .expect(200)
          .expect({
            method: {
              GET: {
                response_status: 200,
                response_data: {
                  response: 'world',
                },
              },
              POST: {
                response_status: 201,
                response_data: {
                  response: '<id>',
                },
                callback: {
                  url: 'http://localhost:5000',
                  payload: {
                    id: '<id>',
                  },
                  method: 'GET',
                  delay_ms: 2000,
                },
              },
            },
          });
      });

      it('updates response from registered mocked route)', async () => {
        const newRouteData = {
          GET: {
            response_status: 404,
            response_data: {},
          },
        };

        await request(app.getHttpServer())
          .patch('/config/hello')
          .send(newRouteData)
          .expect(200)
          .expect(newRouteData);

        expect(routeRepository.getRoute('hello')).toEqual(newRouteData);
      });

      it('deletes mocked route)', async () => {
        await request(app.getHttpServer()).delete('/config/hello').expect(200);

        expect(routeRepository.getRoute('hello')).toBeNull();
      });
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
          routeService as any,
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
});
