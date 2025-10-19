export class CustomError extends Error {
    public statusCode: number;
    public code: string;
    public details?: any;

    constructor(message: string, code = 'INTERNAL_ERROR', statusCode = 500, details?: any) {
        super(message);
        this.name = 'CustomError';
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class ValidationError extends CustomError {
        constructor(details: any) {
        super('Validation failed', 'VALIDATION_ERROR', 400, details);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends CustomError {
    constructor(message = 'Resource not found', details?: any) {
        super(message, 'NOT_FOUND', 404, details);
        this.name = 'NotFoundError';
    }
}

export class ProviderError extends CustomError {
    constructor(message = 'Provider error', details?: any) {
        super(message, 'PROVIDER_ERROR', 502, details);
        this.name = 'ProviderError';
    }
}
