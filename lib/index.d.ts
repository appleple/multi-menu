interface Option {
    backBtnClass: string;
    activeMenuClass: string;
    disableMenuClass: string;
    collapseClass: string;
    prependHTML: string;
    levelLimit: number;
}
export default class MultiMenu {
    multiMenu: HTMLElement;
    opt: Option;
    constructor(selector: string | HTMLElement, option?: Partial<Option>);
    private setLevels;
    private flattenList;
    private backLink;
    private forwardLink;
    private setLink;
    activateMenu(ulId: string): void;
    private setMenu;
}
export {};
