// TODO: why <TEvent> needed in allOff()?
interface TMap<T> {
    [s: string]: T;
    
    [s: number]: T
}

interface TRecMap<T> {
    [s: string]: T | TRecMap<T>;
    
    [s: number]: T | TRecMap<T>
}


type TEvent = keyof HTMLElementEventMap;
type TEventFunctionMap<K extends TEvent> = {
    [P in K]?: (event: HTMLElementEventMap[P]) => void;
};

type HTMLTag = keyof HTMLElementTagNameMap;
type QuerySelector = HTMLTag | string;

type ChildrenObj = TMap<QuerySelector> | TRecMap<QuerySelector>
type Enumerated<T> =
    T extends (infer U)[] ? [number, U][]
        : T extends TMap<(infer U)> ? [keyof T, U][]
        : T extends boolean ? never : any;
type TReturnBoolean = (s: string) => boolean;
type AnyFunction = (...args: any[]) => any;
