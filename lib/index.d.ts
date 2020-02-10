interface Option {
    backBtnClass: string;
    activeMenuClass: string;
    disableMenuClass: string;
    collapseClass: string;
    flattenedClass: string;
    fetchAttribute: string;
    linkOnToggle: boolean;
    prependHTML: (link: HTMLLinkElement) => string;
    appendHTML: (link: HTMLLinkElement) => string;
    levelLimit: number;
}
export default class MultiMenu {
    multiMenu: HTMLElement;
    childCount: number;
    opt: Option;
    constructor(selector: string | HTMLElement, option?: Partial<Option>);
    private setLevels;
    private getMaxLevel;
    private flattenList;
    private backLink;
    private fetchList;
    private forwardLink;
    private setLink;
    private setActiveMenu;
    private setMenu;
}
export {};
