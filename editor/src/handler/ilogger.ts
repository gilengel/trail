export enum LogLevel {
    Info = "info",
    Error = "error",
    Warning = "warning",
}


/**
 * Handler for all logging messages of the editor.
 */
export interface ILoggerHandler {

    /**
     * Adds the log messages to the list of already logged messages. Might trigger that it is shown to the user.
     *
     * @param message text that is displayed to the user
     * @param level
     */
    push(message: string, level: LogLevel): void,

    /**
     * Returns the last logged message with the given level.
     *
     * @param level
     * @return the text of the message, undefined if not found.
     */
    last(level: LogLevel): string | undefined,

    /**
     * Removes all logged messages
     */
    clear(): void
}
