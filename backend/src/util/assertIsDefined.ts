// <T> means generic types
//function asserts if variable passed is defined
// this function allows us to pass any type of argument to it, then it checks if type is not null
export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (!val) {
    throw Error("expected 'val' to be defined but received " + val);
  }
}
