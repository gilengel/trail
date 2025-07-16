export const ApiProperty = (options?: any) => {
    // If running in the backend (NestJS), import @nestjs/swagger and return the real decorator
    const { ApiProperty } = require('@nestjs/swagger');
    return ApiProperty(options);
};