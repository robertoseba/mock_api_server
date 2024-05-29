import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ManagementModule } from '../src/application/management/mgnt.module';
import { RouteRepository } from '../src/application/shared/repository/route.repository';

const testConfig = () => ({
  MOCK_FILE: './test/fixtures/mock-test-routes.json',
});

describe('Management (e2e)', () => {
  let app: INestApplication;

  let routeRepository: RouteRepository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [testConfig],
        }),
        ManagementModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    routeRepository = moduleFixture.get<RouteRepository>(RouteRepository);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('creating new route', () => {
    it('404 if route doesnt exist', async () => {
      await request(app.getHttpServer())
        .get('/management/new_route')
        .expect(404);
      expect(routeRepository.getRoute('new_route')).toBeNull();
    });

    it('creates new route', async () => {
      const newRouteData = {
        method: {
          POST: {
            response_status: 200,
            response_data: {
              nfeId: '<id>',
            },
          },
        },
      };

      const expectedResponse = {
        data: {
          url: 'new_route',
          ...newRouteData,
        },
      };

      await request(app.getHttpServer())
        .post('/management/new_route')
        .send(newRouteData)
        .expect(201)
        .expect(expectedResponse);

      expect(routeRepository.getRoute('new_route')).toEqual(
        expect.objectContaining(expectedResponse),
      );
    });
  });

  describe('Preloaded routes from json file', () => {
    describe('Config mocked routes', () => {
      it('retrieve info from registered mocked route)', async () => {
        await request(app.getHttpServer())
          .get('/management/hello')
          .expect(200)
          .expect({
            data: {
              url: 'hello',
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
            },
          });
      });

      it('updates response from registered mocked route)', async () => {
        const newRouteData = {
          method: {
            GET: {
              response_status: 404,
              response_data: {},
            },
          },
        };

        const expectedResponse = {
          data: {
            url: 'hello',
            ...newRouteData,
          },
        };

        await request(app.getHttpServer())
          .patch('/management/hello')
          .send(newRouteData)
          .expect(200)
          .expect(expectedResponse);

        expect(routeRepository.getRoute('hello')).toEqual(expectedResponse);
      });

      it('deletes mocked route)', async () => {
        await request(app.getHttpServer())
          .delete('/management/hello')
          .expect(200);

        expect(routeRepository.getRoute('hello')).toBeNull();
      });
    });
  });
});
