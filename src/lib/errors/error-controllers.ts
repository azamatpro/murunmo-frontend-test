import { BaseError } from './base-error';

export class ValidationError extends BaseError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 400, true, context);
  }
}

export class NotFoundError extends BaseError {
  constructor(resource: string, id?: string | number) {
    super(`${resource} ${id ? `with ID ${id}` : ''} not found`, 404, true, {
      resource,
      id
    });
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 500, true, context);
  }
}

export class DuplicateError extends BaseError {
  constructor(resource: string, field: string, value: any) {
    super(`${resource} with ${field} '${value}' already exists`, 409, true, {
      resource,
      field,
      value
    });
  }
}
