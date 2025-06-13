export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveLoader: () => CustomMatcherResult;
    }
  }
}
