"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var utility_1 = require("./utility");
var defaultOption = {
    backBtnClass: 'js-menu-back-btn',
    disableMenuClass: 'js-disable-menu',
    activeMenuClass: 'active',
    collapseClass: 'js-collapse',
    prependHTML: function (link) { return "<a href=\"#\" class=\"js-menu-back-btn\">\u2190 Back </a></li>"; },
    levelLimit: Infinity
};
var MultiMenu = /** @class */ (function () {
    function MultiMenu(selector, option) {
        if (option === void 0) { option = {}; }
        this.multiMenu = typeof selector === 'string' ? document.querySelector(selector) : selector;
        this.opt = __assign(__assign({}, defaultOption), option);
        this.setMenu();
    }
    MultiMenu.prototype.setLevels = function (uls) {
        var _this = this;
        [].forEach.call(uls, function (ul, i) {
            var level = 0;
            var anscestor = ul;
            var match = 'ul ul';
            var flag = false;
            if (utility_1.hasClass(ul, _this.opt.disableMenuClass)) {
                var childUls = ul.querySelectorAll('ul');
                [].forEach.call(childUls, function (childUl) {
                    utility_1.addClass(childUl, _this.opt.disableMenuClass);
                });
                return;
            }
            while (anscestor !== null) {
                level += 1;
                if (level > _this.opt.levelLimit) {
                    flag = true;
                    break;
                }
                anscestor = utility_1.findAncestor(anscestor, match);
                match += ' ul';
            }
            if (flag) {
                return;
            }
            var parentElement = utility_1.findAncestor(ul.parentElement, 'ul');
            if (parentElement) {
                ul.dataset.parentId = parentElement.dataset.id;
            }
            ul.dataset.id = "" + i;
            ul.dataset.level = level;
        });
    };
    MultiMenu.prototype.flattenList = function (uls) {
        var _this = this;
        var maxLevels = 0;
        [].forEach.call(uls, function (ul) {
            var level = parseInt(ul.dataset.level, 10);
            if (level > maxLevels) {
                maxLevels = level;
            }
        });
        [].forEach.call(uls, function (ul) {
            if (!ul.dataset.id) {
                return;
            }
            ul.style.zIndex = "" + (maxLevels - parseInt(ul.dataset.level, 10));
            if (ul.previousElementSibling && ul.previousElementSibling.dataset) {
                ul.previousElementSibling.dataset.ulId = ul.dataset.id;
            }
            if (_this.opt.prependHTML) {
                var link = _this.multiMenu.querySelector("[data-ul-id=\"" + ul.dataset.id + "\"]");
                if (link) {
                    utility_1.prepend(ul, _this.opt.prependHTML(link));
                }
            }
            _this.multiMenu.appendChild(ul);
        });
    };
    MultiMenu.prototype.backLink = function (link) {
        var ul = utility_1.findAncestor(link, 'ul');
        var parentId = ul.dataset.parentId;
        if (parentId) {
            var targetUls = this.multiMenu.querySelectorAll('ul');
            var parentUl_1 = [].find.call(targetUls, function (targetUl) {
                if (targetUl.dataset.id === parentId) {
                    return true;
                }
                return false;
            });
            parentUl_1.style.display = 'block';
            setTimeout(function () {
                parentUl_1.style.transform = 'translateX(0)';
            }, 100);
        }
    };
    MultiMenu.prototype.forwardLink = function (link) {
        var _this = this;
        var ul = utility_1.findAncestor(link, 'ul');
        ul.style.transform = 'translateX(-100%)';
        var targetUls = this.multiMenu.querySelectorAll('ul');
        [].forEach.call(targetUls, function (targetUl) {
            if (link.dataset.ulId === targetUl.dataset.id || targetUl === ul) {
                targetUl.style.display = 'block';
                return;
            }
            if (!utility_1.hasClass(targetUl, _this.opt.disableMenuClass)) {
                targetUl.style.display = 'none';
            }
        });
    };
    MultiMenu.prototype.setLink = function (link) {
        var _this = this;
        if (utility_1.hasClass(link, this.opt.backBtnClass)) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                _this.backLink(link);
            });
            utility_1.addClass(link, this.opt.collapseClass);
        }
        if (!link.dataset.ulId) {
            return;
        }
        utility_1.addClass(link, this.opt.collapseClass);
        link.addEventListener('click', function (e) {
            e.preventDefault();
            _this.forwardLink(link);
        });
    };
    MultiMenu.prototype.activateMenu = function (ulId) {
        var targetUls = this.multiMenu.querySelectorAll('ul');
        [].forEach.call(targetUls, function (targetUl) {
            if (ulId === targetUl.dataset.id) {
                targetUl.style.display = 'block';
                return;
            }
            targetUl.style.display = 'none';
        });
    };
    MultiMenu.prototype.setMenu = function () {
        var _this = this;
        if (!this.multiMenu) {
            return;
        }
        utility_1.addClass(this.multiMenu, 'multi-menu');
        var uls = this.multiMenu.querySelectorAll('ul');
        this.setLevels(uls);
        this.flattenList(uls);
        var links = this.multiMenu.querySelectorAll('a');
        [].forEach.call(links, function (link) {
            _this.setLink(link);
        });
        var newUls = this.multiMenu.querySelectorAll('ul');
        var activeUl = [].find.call(newUls, function (newUl) {
            if (utility_1.hasClass(newUl, _this.opt.activeMenuClass)) {
                return true;
            }
            return false;
        });
        var targetUls = this.multiMenu.querySelectorAll('ul');
        [].forEach.call(targetUls, function (targetUl) {
            if (activeUl === targetUl) {
                targetUl.style.display = 'block';
                return;
            }
            if (activeUl.dataset.parentId === targetUl.dataset.id) {
                var ul = targetUl;
                while (true) {
                    ul.style.transform = 'translateX(-100%)';
                    if (ul.dataset.parentId) {
                        ul = _this.multiMenu.querySelector("[data-id=\"" + ul.dataset.parentId + "\"]");
                    }
                    else {
                        break;
                    }
                }
            }
            else {
                targetUl.style.display = 'none';
            }
        });
    };
    return MultiMenu;
}());
exports.default = MultiMenu;
//# sourceMappingURL=index.js.map