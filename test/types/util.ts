import {BetterHTMLElement} from "../../src/index";

export function isBHE<T extends BetterHTMLElement>(arg: T, bheSubType): arg is T {
    return (arg instanceof bheSubType)
}