import { addClass, findAncestor, prepend, hasClass } from './utility';

interface Option {
  backBtn: string;
  prependHTML: string;
}

const defaultOption = {
  backBtn: '.js-menu-back-btn',
  prependHTML: '<li><a href="#" class="js-menu-back-btn">← Back</a></li>',
}

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
      while (anscestor !== null) {
        level += 1;
        anscestor = findAncestor(anscestor, match);
        match += ' ul';
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
      ul.style.zIndex = `${maxLevels - parseInt(ul.dataset.level, 10)}`;
      if (ul.previousElementSibling && ul.previousElementSibling.dataset) {
        ul.previousElementSibling.dataset.ulId = ul.dataset.id;
      }
      this.multiMenu.appendChild(ul);
    });
  }

  private setLink(link: HTMLLinkElement) {
    if (hasClass(link, this.opt.backBtn.slice(1))) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
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
      });
      addClass(link, 'js-collapse');
    }

    if (!link.dataset.ulId) {
      return;
    }

    addClass(link, 'js-collapse');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const ul = findAncestor(link, 'ul');
      ul.style.transform = 'translateX(-100%)';
      const targetUls = this.multiMenu.querySelectorAll('ul');
      [].forEach.call(targetUls, (targetUl) => {
        if (link.dataset.ulId === targetUl.dataset.id || targetUl === ul) {
          targetUl.style.display = 'block';
          return;
        }
        targetUl.style.display = 'none';
      });
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
  }
}