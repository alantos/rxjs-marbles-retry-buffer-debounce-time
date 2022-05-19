import { bufferDebounceTime } from './buffer-debounce-time';
import { TestScheduler } from 'rxjs/testing';

describe('Given bufferDebounceTime operator, observable', () => {
  it('should buffer values during debounce time', () => {
    const scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    scheduler.run((helpers) => {
      const { expectObservable, cold } = helpers;

      const observable = cold('a 300ms b 500ms c');

      const expected = '2802ms a';
      const values = {
        a: ['a', 'b', 'c'],
      };

      expectObservable(observable.pipe(bufferDebounceTime(2000))).toBe(
        expected,
        values
      );
    });
  });
});
