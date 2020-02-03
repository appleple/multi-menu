"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqId = function () { return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase(); };
exports.getWindowWidth = function () {
    if (document && document.documentElement) {
        return document.documentElement.clientWidth;
    }
    else if (window && window.innerWidth) {
        return window.innerWidth;
    }
    return 0;
};
exports.getWindowHeight = function () { return window.innerHeight || document.documentElement.clientHeight || 0; };
exports.hasClass = function (el, className) {
    if (el.classList) {
        return el.classList.contains(className);
    }
    return new RegExp("(^| )" + className + "( |$)", 'gi').test(el.className);
};
exports.addClass = function (element, className) {
    if (element.classList) {
        element.classList.add(className);
    }
    else {
        element.className += " " + className;
    }
};
exports.removeClass = function (element, className) {
    if (element.classList) {
        element.classList.remove(className);
    }
    else {
        element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(' ').join('|') + "(\\b|$)", 'gi'), ' ');
    }
};
exports.getScrollTop = function () { return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0; };
exports.wrap = function (el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
};
exports.after = function (el, html) {
    el.insertAdjacentHTML('afterend', html);
};
exports.isIE = function () {
    var userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.match(/(msie|MSIE)/) || userAgent.match(/(T|t)rident/)) {
        return true;
    }
    return false;
};
exports.triggerEvent = function (el, eventName, options) {
    var event;
    if (window.CustomEvent) {
        event = new CustomEvent(eventName, { cancelable: true });
    }
    else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, false, false, options);
    }
    el.dispatchEvent(event);
};
exports.append = function (element, string) {
    var div = document.createElement('div');
    div.innerHTML = string;
    while (div.children.length > 0) {
        element.appendChild(div.children[0]);
    }
};
exports.prepend = function (element, string) {
    var div = document.createElement('div');
    div.innerHTML = string;
    while (div.children.length > 0) {
        element.insertBefore(div.children[0], element.firstChild);
    }
};
exports.matches = function (element, query) {
    // @ts-ignore
    var finds = (element.document || element.ownerDocument).querySelectorAll(query);
    var i = finds.length;
    // eslint-disable-next-line
    while (--i >= 0 && finds.item(i) !== element) { }
    return i > -1;
};
exports.findAncestor = function (element, selector) {
    // @ts-ignore
    if (typeof element.closest === 'function') {
        // @ts-ignore
        return element.closest(selector) || null;
    }
    while (element && element !== document) {
        if (exports.matches(element, selector)) {
            return element;
        }
        element = element.parentElement;
    }
    return null;
};
//# sourceMappingURL=utility.js.map