import { addClass, findAncestor, prepend, hasClass, append } from './utility';

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

const defaultOption = {
  backBtnClass: 'js-menu-back-btn',
  disableMenuClass: 'js-disable-menu',
  activeMenuClass: 'active',
  flattenedClass: 'flattened',
  collapseClass: 'js-collapse',
  fetchAttribute: 'data-fetch-url',
  linkOnToggle: false,
  prependHTML: (link) => `<li><a href="#" class="js-menu-back-btn">← Back </a></li>`,
  appendHTML: (link) => `<span class="multi-menu-arrow"></span>`,
  levelLimit: Infinity,
}

export default class MultiMenu {

  multiMenu!: HTMLElement;
  childCount: number = 0;
  opt!: Option;

  constructor(selector: string | HTMLElement, option: Partial<Option> = {}) {
    this.multiMenu = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.opt = { ...defaultOption, ...option };
    addClass(this.multiMenu, 'multi-menu');
    this.setMenu(this.multiMenu.querySelectorAll('ul'));
    this.setActiveMenu();
  }

  private setLevels(uls: NodeListOf<HTMLUListElement>, offset: number) {
    [].forEach.call(uls, (ul) => {
      if (ul.dataset.level) {
        return;
      }
      let level = 0;
      let anscestor = ul;
      let match = 'ul ul';
      let flag = false;
      if (hasClass(ul, this.opt.disableMenuClass)) {
        const childUls = ul.querySelectorAll('ul');
        [].forEach.call(childUls, (childUl) => {
          addClass(childUl, this.opt.disableMenuClass);
        });
        return;
      }
      while (anscestor !== null) {
        level += 1;
        if ( level > this.opt.levelLimit) {
          flag = true;
          break;
        }
        anscestor = findAncestor(anscestor, match);
        match += ' ul';
      }
      if (flag) {
        return;
      }
      const parentElement = findAncestor(ul.parentElement, 'ul');
      if (parentElement) {
        ul.dataset.parentId = parentElement.dataset.id;
      }
      if (!ul.dataset.id) {
        ul.dataset.id = `${this.childCount}`;
        this.childCount++;
      }
      ul.dataset.level = level + offset;
    });
    const maxLevels = this.getMaxLevel();
    [].forEach.call(uls, ul => {
      ul.style.zIndex = `${maxLevels - parseInt(ul.dataset.level, 10)}`;
    });
  }

  private getMaxLevel() {
    let maxLevels = 0;
    [].forEach.call(this.multiMenu.querySelectorAll('ul'), (ul) => {
      const level = parseInt(ul.dataset.level, 10);
      if (level > maxLevels) {
        maxLevels = level;
      }
    });
    return maxLevels;
  }

  private flattenList(uls: NodeListOf<HTMLUListElement>) {
    [].forEach.call(uls, (ul) => {
      if (hasClass(ul, this.opt.flattenedClass)) {
        return;
      }
      if (ul.previousElementSibling && ul.previousElementSibling.dataset) {
        ul.previousElementSibling.dataset.ulId = ul.dataset.id;
        append(ul.previousElementSibling, this.opt.appendHTML(ul.previousElementSibling));
      }
      if (this.opt.prependHTML) {
        const link: HTMLLinkElement = this.multiMenu.querySelector(`[data-ul-id="${ul.dataset.id}"]`);
        if (link) {
          prepend(ul, this.opt.prependHTML(link));
        }
      }
      this.multiMenu.appendChild(ul);
      addClass(ul, this.opt.flattenedClass);
    });
  }

  private backLink(link: HTMLLinkElement) {
    const ul = findAncestor(link, 'ul');
    const { parentId } = ul.dataset;
    if (parentId) {
      const targetUls = this.multiMenu.querySelectorAll('ul');
      const parentUl = [].find.call(targetUls, (targetUl) => {
        if (targetUl.dataset.id === parentId) {
          return true;
        }
        return false;
      });
      parentUl.style.display = 'block';
      setTimeout(() => {
        parentUl.style.transform = 'translateX(0)';
      }, 100);
      this.fetchList(parentUl);
    }
  }

  private fetchList(ul: HTMLUListElement) {
    const links = ul.querySelectorAll('a');
    [].forEach.call(links, async (link: HTMLLinkElement) => {
      if (!link) {
        return;
      }
      const url = link.getAttribute(this.opt.fetchAttribute);
      if (!url) {
        return;
      }
      const res = await fetch(url);
      const html = await res.text();
      link.removeAttribute(this.opt.fetchAttribute);
      link.insertAdjacentHTML('afterend', html);
      this.setMenu(this.multiMenu.querySelectorAll('ul'), parseInt(ul.dataset.level, 10));
    });
  }

  private forwardLink(link: HTMLLinkElement) {
    const ul = findAncestor(link, 'ul');
    ul.style.transform = 'translateX(-100%)';
    const targetUls = this.multiMenu.querySelectorAll('ul');
    [].forEach.call(targetUls, (targetUl) => {
      if (link.dataset.ulId === targetUl.dataset.id || targetUl === ul) {
        targetUl.style.display = 'block';
        this.fetchList(targetUl);
        return;
      }
      if (!hasClass(targetUl, this.opt.disableMenuClass)) {
        targetUl.style.display = 'none';
      }
    });
  }

  private setLink(link: HTMLLinkElement) {
    if (hasClass(link, this.opt.backBtnClass)) {
      addClass(link, this.opt.collapseClass);
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.backLink(link);
      });
    }

    if (!link.dataset.ulId) {
      return;
    }

    addClass(link, this.opt.collapseClass);
    link.addEventListener('click', (e) => {
      // @ts-ignore
      if (!this.opt.linkOnToggle || (!link.href || !e.target.dataset.ulId)) {
        e.preventDefault();
        this.forwardLink(link);
      }
    });
  }

  private setActiveMenu() {
    const newUls = this.multiMenu.querySelectorAll('ul');
    const activeUl = [].find.call(newUls, (newUl) => {
      if (hasClass(newUl, this.opt.activeMenuClass)) {
        return true;
      }
      return false;
    });
    if (!activeUl) {
      return;
    }
    const targetUls = this.multiMenu.querySelectorAll('ul');
    [].forEach.call(targetUls, (targetUl: HTMLUListElement) => {
      if (activeUl === targetUl) {
        targetUl.style.display = 'block';
        return;
      }
      if (activeUl.dataset.parentId === targetUl.dataset.id) {
        let ul = targetUl;
        while(true) {
          ul.style.transform = 'translateX(-100%)';
          if (ul.dataset.parentId) {
            ul = this.multiMenu.querySelector(`[data-id="${ul.dataset.parentId}"]`);
          } else {
            break;
          }
        }
      } else {
        targetUl.style.display = 'none';
      }
    });
  }

  private setMenu(uls: NodeListOf<HTMLUListElement>, offset = 0) {
    this.setLevels(uls, offset);
    this.flattenList(uls);
    const links = this.multiMenu.querySelectorAll(`a:not(.${this.opt.collapseClass})`);
    [].forEach.call(links, (link: HTMLLinkElement) => {
      this.setLink(link);
    });
  }
}