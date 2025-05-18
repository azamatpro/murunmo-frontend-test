import { NextResponse } from 'next/server';
import { BaseError } from './base-error';

export class ErrorHandler {
  private static isDev = process.env.NODE_ENV === 'development';

  public static handle(error: Error | BaseError): NextResponse {
    if (error instanceof BaseError) {
      return this.handleOperationalError(error);
    }
    return this.handleUnknownError(error);
  }

  private static handleOperationalError(error: BaseError): NextResponse {
    const response = {
      success: false,
      message: error.message,
      ...(this.isDev && {
        stack: error.stack,
        context: error.context
      })
    };

    return NextResponse.json(response, { status: error.statusCode });
  }

  private static handleUnknownError(error: Error): NextResponse {
    const response = {
      success: false,
      message: this.isDev ? error.message : 'An unexpected error occurred',
      ...(this.isDev && {
        stack: error.stack
      })
    };

    return NextResponse.json(response, { status: 500 });
  }
}
