export const getUniqId = () => (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();

export const getWindowWidth = () => {
  if (document && document.documentElement) {
    return document.documentElement.clientWidth;
  } else if (window && window.innerWidth) {
    return window.innerWidth;
  }
  return 0;
};

export const getWindowHeight = () => window.innerHeight || document.documentElement.clientHeight || 0;

export const hasClass = (el: HTMLElement, className: string) => {
  if (el.classList) {
    return el.classList.contains(className);
  }
  return new RegExp(`(^| )${className}( |$)`, 'gi').test(el.className);
};

export const addClass = (element: HTMLElement, className: string) => {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += ` ${className}`;
  }
};

export const removeClass = (element: HTMLElement, className: string) => {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    element.className = element.className.replace(new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'), ' ');
  }
};

export const getScrollTop = () => window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

export const wrap = (el: HTMLElement, wrapper: HTMLElement) => {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
};

export const after = (el: HTMLElement, html: string) => {
  el.insertAdjacentHTML('afterend', html);
};

export const isIE = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.match(/(msie|MSIE)/) || userAgent.match(/(T|t)rident/)) {
    return true;
  }
  return false;
};

export const triggerEvent = (el: HTMLElement, eventName: string, options: EventListenerOptions) => {
  let event;
  if (window.CustomEvent) {
    event = new CustomEvent(eventName, { cancelable: true });
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, false, false, options);
  }
  el.dispatchEvent(event);
};

export const append = (element: HTMLElement, string: string) => {
  const div = document.createElement('div');
  div.innerHTML = string;
  while (div.children.length > 0) {
    element.appendChild(div.children[0]);
  }
};

export const prepend = (element: HTMLElement, string: string) => {
  const div = document.createElement('div');
  div.innerHTML = string;
  while (div.children.length > 0) {
    element.insertBefore(div.children[0], element.firstChild);
  }
};

export const matches = (element: HTMLElement | Document, query: string) => {
  // @ts-ignore
  const finds = (element.document || element.ownerDocument).querySelectorAll(query);
  let i = finds.length;
  // eslint-disable-next-line
  while (--i >= 0 && finds.item(i) !== element) {}
  return i > -1;
};

export const findAncestor = (element: HTMLElement | Document, selector: string) => {
  // @ts-ignore
  if (typeof element.closest === 'function') {
    // @ts-ignore
    return element.closest(selector) || null;
  }
  while (element && element !== document) {
    if (matches(element, selector)) {
      return element;
    }
    element = element.parentElement;
  }
  return null;
};
