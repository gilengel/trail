import {describe, expect, it} from 'vitest';
import {LoggerHandler} from "./logger";
import {LogLevel} from "./ilogger";

describe("LoggerHandler", () => {
    it("logs a message with the given level", () => {
        const logger = new LoggerHandler();
        expect(logger.last(LogLevel.Warning)).toBeUndefined();
        logger.push("test log", LogLevel.Warning);
        expect(logger.last(LogLevel.Warning)).toBe("test log");
        expect(logger.last(LogLevel.Info)).toBeUndefined();
    })

    it("clears all log messages", () => {
        const logger = new LoggerHandler();
        logger.push("test log", LogLevel.Warning);
        logger.clear()
        expect(logger.last(LogLevel.Info)).toBeUndefined();
        expect(logger.last(LogLevel.Warning)).toBeUndefined();
        expect(logger.last(LogLevel.Error)).toBeUndefined();
    })
});