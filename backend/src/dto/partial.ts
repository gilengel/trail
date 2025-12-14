/* eslint-disable */
/**
 * @file Defines a type where only a part is known of.
 * @param BaseClass
 */
export const PartialType = <T extends new (...args: any[]) => any>(
  BaseClass: T,
): T => {
  // If in NestJS (backend), import PartialType from NestJS
  const { PartialType } = require('@nestjs/mapped-types');
  return PartialType(BaseClass);
};
