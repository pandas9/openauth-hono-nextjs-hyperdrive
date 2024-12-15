// src/adapter/adapter.ts
class AdapterError extends Error {
  constructor() {
    super(...arguments);
  }
}

class AdapterUnknownError extends AdapterError {
  constructor() {
    super(...arguments);
  }
}
export {
  AdapterUnknownError,
  AdapterError
};
