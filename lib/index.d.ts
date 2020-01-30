interface Option {
    backBtn: string;
    prependHTML: string;
}
export default class MultiMenu {
    multiMenu: HTMLElement;
    opt: Option;
    constructor(selector: string | HTMLElement, option?: Partial<Option>);
    private setLevels;
    private flattenList;
    private setLink;
    private setMenu;
}
export {};
