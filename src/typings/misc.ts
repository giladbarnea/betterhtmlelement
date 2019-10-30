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
