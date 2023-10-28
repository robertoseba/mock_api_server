import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from '../src/core/core.module';

const testConfig = () => ({
  MOCK_FILE: './mock_api_nest/test/fixtures/mock-test-routes.json',
});

describe('App (e2e)', () => {
  let app: INestApplication;

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
    await app.init();
  });

  describe('Preloaded routes from json file', () => {
    it('/hello (GET)', () => {
      request(app.getHttpServer())
        .get('/hello')
        .expect(200)
        .expect({ response: 'world' });
    });

    it('/hello (POST)', () => {
      request(app.getHttpServer())
        .post('/hello')
        .send({ id: 23 })
        .expect(201)
        .expect({ response: 23 });
    });
  });
});
