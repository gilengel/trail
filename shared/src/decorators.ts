export const ApiProperty = (options?: any) => {
    if (typeof window !== 'undefined') {
        // If running in the browser (Nuxt), return a no-op decorator
        return () => {};
    }
    // If running in the backend (NestJS), import @nestjs/swagger and return the real decorator
    const { ApiProperty } = require('@nestjs/swagger');
    return ApiProperty(options);
};