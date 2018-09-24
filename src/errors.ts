interface BaseError {
  message: string;
  code: string;
}

export interface UnknownError extends BaseError {
  message: string;
  code: 'error/unknown';
}

export interface ValidationError extends BaseError {
  message: string;
  code: 'error/validation';
  details: ValidationErrorDetails[];
}

export interface ValidationErrorDetails extends BaseError {
  message: string;
  code: 'error/validation-required' | 'error/validation-url';
  field: string;
}

export type ErrorObject = UnknownError | ValidationError;
