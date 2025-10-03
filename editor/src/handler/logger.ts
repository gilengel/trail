import {ref, type Ref} from "vue";

export enum LogLevel {
    Info = "info",
    Error = "error",
    Warning = "warning",
}

type LogMessage = {
    level: LogLevel,
    message: string
}

/**
 * Handler for all logging messages of the editor.
 */
export class LoggerHandler {
    private _logMessages: Ref<LogMessage[]> = ref([]);

    /**
     * Adds the log messages to the list of already logged messages. Might trigger that it is shown to the user.
     *
     * @param message text that is displayed to the user
     * @param level
     */
    public push(message: string, level: LogLevel): void {
        this._logMessages.value.push({message, level})
    }

    /**
     * Returns the last logged message with the given level.
     *
     * @param level
     * @return the text of the message, undefined if not found.
     */
    public last(level: LogLevel): string | undefined {
        const message = this._logMessages.value.reverse().find((value: LogMessage) => value.level === level)

        if (!message) {
            return undefined;
        }

        return message.message;
    }

    /**
     * Removes all logged messages
     */
    public clear(): void {
        this._logMessages.value = [];
    }
}
