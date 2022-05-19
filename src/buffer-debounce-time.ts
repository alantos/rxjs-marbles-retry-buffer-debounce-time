import { buffer, debounceTime } from 'rxjs/operators';
import { Observable, OperatorFunction } from 'rxjs';

type BufferDebounceTime = <T>(debounce: number) => OperatorFunction<T, T[]>;

export const bufferDebounceTime: BufferDebounceTime = (debounce) => (source) =>
  new Observable((observer) =>
    source.pipe(buffer(source.pipe(debounceTime(debounce)))).subscribe({
      next(x) {
        observer.next(x);
      },
      error(err) {
        observer.error(err);
      },
      complete() {
        observer.complete();
      },
    })
  );
