export const PartialType = <T extends new (...args: any[]) => any>(BaseClass: T): T => {
    if (typeof window !== 'undefined') {
        // If in Nuxt (frontend), return the BaseClass as-is (no modification)
        return BaseClass;
    }

    // If in NestJS (backend), import PartialType from NestJS
    const { PartialType } = require('@nestjs/mapped-types');
    return PartialType(BaseClass);
};