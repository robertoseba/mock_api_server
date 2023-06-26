import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 100,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 100,
      maxVUs: 200,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95) < 10'],
  },
};

export default function () {
  const res = http.get('http://server:3000/');

  check(res, {
    'is status 200': (r) => r.status === 200,
  });
}
