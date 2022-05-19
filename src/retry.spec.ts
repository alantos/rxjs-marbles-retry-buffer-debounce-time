import { retry } from './retry';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';

const mockResponse = {
  id: 1,
  name: 'test-name',
};
const delay = 1000;
const count = 5;
const backoffMultiplier = 2;

describe('retry', () => {
  it('should emit correct value when given observer not throwing error', () => {
    const sut = retry(of({ data: 1 }));

    sut(delay, count).subscribe((response) => {
      expect(response).toEqual({ data: 1 });
    });
  });

  it('should retry 5 times and throw error at the end when given observable throws error', () => {
    const mockObservable = of({}).pipe(
      map(() => {
        throw new Error('test');
      })
    );
    const sut = retry(mockObservable);

    const scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    scheduler.run((helpers) => {
      const { expectObservable } = helpers;

      const expected = '5000ms #';

      expectObservable(sut(delay, count)).toBe(expected, {}, new Error('test'));
    });
  });

  it('should retry 2 times and emit correct value', () => {
    let counter = 0;

    const mockObservable = of(mockResponse).pipe(
      map((policy) => {
        counter++;
        if (counter < 3) throw new Error('test');
        return policy;
      })
    );
    const sut = retry(mockObservable);

    const scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    scheduler.run((helpers) => {
      const { expectObservable } = helpers;

      const expected = '2000ms (a|)';
      const values = {
        a: mockResponse,
      };

      expectObservable(sut(delay, count)).toBe(expected, values);
    });
  });

  it('should retry with backoff 5 times and throw error at the end when given observable throws error', () => {
    const mockObservable = of({}).pipe(
      map(() => {
        throw new Error('test');
      })
    );
    const sut = retry(mockObservable);

    const scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    scheduler.run((helpers) => {
      const { expectObservable } = helpers;

      const expected = '31000ms #';

      expectObservable(sut(delay, count, backoffMultiplier)).toBe(
        expected,
        {},
        new Error('test')
      );
    });
  });

  it('should retry with backoff 2 times and emit correct value', () => {
    let counter = 0;

    const mockObservable = of(mockResponse).pipe(
      map((response) => {
        counter++;
        if (counter < 3) throw new Error('test');
        return response;
      })
    );
    const sut = retry(mockObservable);

    const scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    scheduler.run((helpers) => {
      const { expectObservable } = helpers;

      const expected = '3000ms (a|)';
      const values = {
        a: mockResponse,
      };

      expectObservable(sut(delay, count, backoffMultiplier)).toBe(
        expected,
        values
      );
    });
  });
});
