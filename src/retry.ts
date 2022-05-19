import { mergeMap, retryWhen } from 'rxjs/operators';
import { Observable, throwError, timer } from 'rxjs';

type Retry = <T>(
  observable: Observable<T>
) => (
  delayInMs: number,
  count: number,
  backoffMultiplier?: number
) => Observable<T>;

export const retry: Retry =
  (observable) =>
  (delayInMs, count, backoffMultiplier = 1) => {
    return observable.pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error, attempts) => {
            if (attempts + 1 > count) {
              return throwError(error);
            }

            return timer(delayInMs * backoffMultiplier ** attempts);
          })
        )
      )
    );
  };
