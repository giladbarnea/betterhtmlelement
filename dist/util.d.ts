declare function enumerate<T>(obj: T): Enumerated<T>;
declare function bool(val: any): boolean;
declare function wait(ms: number): Promise<any>;
declare function anyValue(obj: any): boolean;
declare function noValue(obj: any): boolean;
declare function isArray<T>(obj: any): obj is Array<T>;
declare function isEmptyArr(collection: any): boolean;
declare function isEmptyObj(obj: any): boolean;
declare function isBHE<T extends BetterHTMLElement>(bhe: T, bheSubType: any): bhe is T;
declare function isType<T>(arg: T): arg is T;
declare function isFunction<T>(fn: T): fn is T;
declare function isObject(obj: any): boolean;
declare function shallowProperty<T>(key: string): (obj: T) => T extends null ? undefined : T[keyof T];
declare function getLength(collection: any): number;