interface TMap<T> {
    [s: string]: T;
    
    [s: number]: T
}

interface TRecMap<T> {
    [s: string]: T | TRecMap<T>;
    
    [s: number]: T | TRecMap<T>
}


