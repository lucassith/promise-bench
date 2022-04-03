import { Type } from '@nestjs/common';
import { plainToClass, TransformOptions } from 'class-transformer';
import * as bench from 'nanobench';

export function rewriteClass<TSource, TDest>(
  source: TSource,
  dest: TDest
): TSource {
  for (const propertyName of Object.getOwnPropertyNames(source)) {
    if (!(propertyName in dest)) dest[propertyName] = source[propertyName];
  }
  return dest as unknown as TSource;
}

export class BetterPromise<T> extends Promise<T> {
  rethrowMap = new Map<Type<Error>, Type<Error>>();

  rethrowAs<TSource extends Type<Error>, TDest extends Type<Error>>(
    source: TSource,
    dest: TDest
  ): this {
    this.rethrowMap.set(source, dest);
    if (this.rethrowMap.size > 1) {
      return this;
    }

    return this.catch((error) => {
      const mappedError = this.rethrowMap.get(
        Object.getPrototypeOf(error).constructor
      );
      if (mappedError) throw new mappedError(error.message);
      throw error;
    }) as this;
  }

  transform<TDest extends Type>(
    to: TDest,
    options: Partial<TransformOptions> = {}
  ): Promise<InstanceType<TDest>> {
    return this.then((value) =>
      plainToClass(to, value, { excludeExtraneousValues: true, ...options })
    );
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => PromiseLike<TResult1> | TResult1)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => PromiseLike<TResult2> | TResult2)
      | undefined
      | null
  ): Promise<TResult1 | TResult2> {
    return rewriteClass(
      this,
      super.then(onfulfilled, onrejected)
    ) as unknown as Promise<TResult1 | TResult2>;
  }
}

class OtherError extends Error {}
class OtherError2 extends Error {}
class OtherError3 extends Error {}
class OtherError4 extends Error {}
class OtherError5 extends Error {}
class OtherError6 extends Error {}
class OtherError7 extends Error {}
class OtherError8 extends Error {}
class OtherError9 extends Error {}
class OtherError10 extends Error {}
class OtherError11 extends Error {}
class OtherError12 extends Error {}
class OtherError13 extends Error {}
class CustomError extends Error {}

bench('rethrow', async function (b) {
  b.start();

  async function f() {
    return new BetterPromise((resolve, reject) => reject(new OtherError6()))
      .rethrowAs(OtherError, Error)
      .rethrowAs(OtherError2, Error)
      .rethrowAs(OtherError3, Error)
      .rethrowAs(OtherError4, Error)
      .rethrowAs(OtherError5, Error)
      .rethrowAs(OtherError6, Error)
      .rethrowAs(OtherError7, Error)
      .rethrowAs(OtherError8, Error)
      .rethrowAs(OtherError9, Error)
      .rethrowAs(OtherError10, Error)
      .rethrowAs(OtherError11, Error)
      .rethrowAs(OtherError12, Error)
      .rethrowAs(OtherError13, Error)
      .rethrowAs(CustomError, Error);
  }

  try {
    await f();
  } catch (e) {
    // gotcha
  }
  b.end();
});

bench('switch', async function (b) {
  b.start();

  async function f() {
    try {
      await Promise.reject(new OtherError6());
    } catch (e) {
      switch (true) {
        case e instanceof OtherError:
          throw Error;
        case e instanceof OtherError2:
          throw Error;
        case e instanceof OtherError3:
          throw Error;
        case e instanceof OtherError4:
          throw Error;
        case e instanceof OtherError5:
          throw Error;
        case e instanceof OtherError6:
          throw Error;
        case e instanceof OtherError7:
          throw Error;
        case e instanceof OtherError8:
          throw Error;
        case e instanceof OtherError9:
          throw Error;
        case e instanceof OtherError10:
          throw Error;
        case e instanceof OtherError11:
          throw Error;
        case e instanceof OtherError12:
          throw Error;

        case e instanceof OtherError13:
          throw Error;

        case e instanceof CustomError:
          throw Error;
      }
      throw e;
    }
  }
  try {
    await f();
  } catch (e) {
    //gotcha
  }
  b.end();
});
