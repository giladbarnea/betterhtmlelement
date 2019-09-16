interface TMap<T> {
    [s: string]: T
}

interface TRecMap<T> {
    [s: string]: T | TRecMap<T>
}


