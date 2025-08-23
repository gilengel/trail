export type EnsureIncludes<T extends readonly any[], K> =
    K extends T[number] ? T : ["Error: must include", K];