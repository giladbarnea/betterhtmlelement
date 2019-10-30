interface BaseElemConstructor {
    id?: string;
    cls?: string;
}

interface SubElemConstructor extends BaseElemConstructor {
    text?: string;
}

interface ImgConstructor extends BaseElemConstructor {
    src?: string;
}

interface AnchorConstructor extends SubElemConstructor {
    href?: string;
}

interface SvgConstructor extends BaseElemConstructor {
    htmlElement?: SVGElement;
}
