import { addClass, findAncestor, prepend, hasClass } from './utility';

interface Option {
  backBtnClass: string;
  activeMenuClass: string;
  disableMenuClass: string;
  collapseClass: string;
  prependHTML: string;
  levelLimit: number;
}

const defaultOption = {
  backBtnClass: 'js-menu-back-btn',
  disableMenuClass: 'js-disable-menu',
  activeMenuClass: 'active',
  collapseClass: 'js-collapse',
  prependHTML: '<li><a href="#" class="js-menu-back-btn">← Back</a></li>',
  levelLimit: Infinity
}

console.log('test!!!');

export default class MultiMenu {

  multiMenu!: HTMLElement;
  opt!: Option;

  constructor(selector: string | HTMLElement, option: Partial<Option> = {}) {
    this.multiMenu = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.opt = { ...defaultOption, ...option };
    this.setMenu();
  }

  private setLevels(uls) {
    [].forEach.call(uls, (ul, i) => {
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
        if (this.opt.prependHTML) {
          prepend(ul, this.opt.prependHTML);
        }
      }
      ul.dataset.id = `${i}`;
      ul.dataset.level = level;
    });
  }

  private flattenList(uls) {
    let maxLevels = 0;
    [].forEach.call(uls, (ul) => {
      const level = parseInt(ul.dataset.level, 10);
      if (level > maxLevels) {
        maxLevels = level;
      }
    });
    [].forEach.call(uls, (ul) => {
      if (!ul.dataset.id) {
        return;
      }
      ul.style.zIndex = `${maxLevels - parseInt(ul.dataset.level, 10)}`;
      if (ul.previousElementSibling && ul.previousElementSibling.dataset) {
        ul.previousElementSibling.dataset.ulId = ul.dataset.id;
      }
      this.multiMenu.appendChild(ul);
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
    }
  }

  private forwardLink(link: HTMLLinkElement) {
    const ul = findAncestor(link, 'ul');
    ul.style.transform = 'translateX(-100%)';
    const targetUls = this.multiMenu.querySelectorAll('ul');
    [].forEach.call(targetUls, (targetUl) => {
      if (link.dataset.ulId === targetUl.dataset.id || targetUl === ul) {
        targetUl.style.display = 'block';
        return;
      }
      if (!hasClass(targetUl, this.opt.disableMenuClass)) {
        targetUl.style.display = 'none';
      }
    });
  }

  private setLink(link: HTMLLinkElement) {
    if (hasClass(link, this.opt.backBtnClass)) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.backLink(link);
      });
      addClass(link, this.opt.collapseClass);
    }

    if (!link.dataset.ulId) {
      return;
    }

    addClass(link, this.opt.collapseClass);
    link.addEventListener('click', (e) => {
      e.preventDefault();
      this.forwardLink(link);
    });
  }

  public activateMenu(ulId: string) {
    const targetUls = this.multiMenu.querySelectorAll('ul');
    [].forEach.call(targetUls, (targetUl) => {
      if (ulId === targetUl.dataset.id) {
        targetUl.style.display = 'block';
        return;
      }
      targetUl.style.display = 'none';
    });
  }

  private setMenu() {
    if (!this.multiMenu) {
      return;
    }
    addClass(this.multiMenu, 'multi-menu');
    const uls = this.multiMenu.querySelectorAll('ul');
    this.setLevels(uls);
    this.flattenList(uls);
    const links = this.multiMenu.querySelectorAll('a');
    [].forEach.call(links, (link) => {
      this.setLink(link);
    });
    const newUls = this.multiMenu.querySelectorAll('ul');
    const activeUl = [].find.call(newUls, (newUl) => {
      if (hasClass(newUl, this.opt.activeMenuClass)) {
        return true;
      }
      return false;
    });
    const targetUls = this.multiMenu.querySelectorAll('ul');
    [].forEach.call(targetUls, (targetUl) => {
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
}