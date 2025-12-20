import {ref, type Ref} from "vue";
import type {ILoggerHandler, LogLevel} from "./ilogger";

type LogMessage = {
    level: LogLevel,
    message: string
}

/**
 * Handler for all logging messages of the editor.
 */
export class LoggerHandler implements ILoggerHandler {
    private _logMessages: Ref<LogMessage[]> = ref([]);

    public push(message: string, level: LogLevel): void {
        this._logMessages.value.push({message, level})
    }

    public last(level: LogLevel): string | undefined {
        const message = this._logMessages.value.reverse().find((value: LogMessage) => value.level === level)

        if (!message) {
            return undefined;
        }

        return message.message;
    }

    public clear(): void {
        this._logMessages.value = [];
    }
}
