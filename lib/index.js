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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var utility_1 = require("./utility");
var defaultOption = {
    backBtnClass: 'js-menu-back-btn',
    disableMenuClass: 'js-disable-menu',
    activeMenuClass: 'active',
    collapseClass: 'js-collapse',
    prependHTML: function (link) { return "<a href=\"#\" class=\"js-menu-back-btn\">\u2190 Back </a></li>"; },
    levelLimit: Infinity,
    preFetchLevel: 2
};
var MultiMenu = /** @class */ (function () {
    function MultiMenu(selector, option) {
        if (option === void 0) { option = {}; }
        this.childCount = 0;
        this.multiMenu = typeof selector === 'string' ? document.querySelector(selector) : selector;
        this.opt = __assign(__assign({}, defaultOption), option);
        utility_1.addClass(this.multiMenu, 'multi-menu');
        this.setMenu(this.multiMenu.querySelectorAll('ul'));
        this.setActiveMenu();
    }
    MultiMenu.prototype.setLevels = function (uls, offset) {
        var _this = this;
        [].forEach.call(uls, function (ul) {
            if (ul.dataset.level) {
                return;
            }
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
            if (!ul.dataset.id) {
                ul.dataset.id = "" + _this.childCount;
                _this.childCount++;
            }
            ul.dataset.level = level + offset;
        });
        var maxLevels = this.getMaxLevel();
        [].forEach.call(uls, function (ul) {
            ul.style.zIndex = "" + (maxLevels - parseInt(ul.dataset.level, 10));
        });
    };
    MultiMenu.prototype.getMaxLevel = function () {
        var maxLevels = 0;
        [].forEach.call(this.multiMenu.querySelectorAll('ul'), function (ul) {
            var level = parseInt(ul.dataset.level, 10);
            if (level > maxLevels) {
                maxLevels = level;
            }
        });
        return maxLevels;
    };
    MultiMenu.prototype.flattenList = function (uls) {
        var _this = this;
        [].forEach.call(uls, function (ul) {
            if (utility_1.hasClass(ul, 'flattened')) {
                return;
            }
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
            utility_1.addClass(ul, 'flattened');
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
            this.fetchList(parentUl_1);
        }
    };
    MultiMenu.prototype.fetchList = function (ul) {
        var _this = this;
        var links = ul.querySelectorAll('a');
        var parentLevel = parseInt(ul.dataset.level);
        [].forEach.call(links, function (link) { return __awaiter(_this, void 0, void 0, function () {
            var res, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!link || !link.dataset.fetchUrl) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, fetch(link.dataset.fetchUrl)];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.text()];
                    case 2:
                        html = _a.sent();
                        link.removeAttribute('data-fetch-url');
                        link.insertAdjacentHTML('afterend', html);
                        this.setMenu(this.multiMenu.querySelectorAll('ul'), parseInt(ul.dataset.level, 10));
                        return [2 /*return*/];
                }
            });
        }); });
    };
    MultiMenu.prototype.forwardLink = function (link) {
        var _this = this;
        var ul = utility_1.findAncestor(link, 'ul');
        ul.style.transform = 'translateX(-100%)';
        var targetUls = this.multiMenu.querySelectorAll('ul');
        [].forEach.call(targetUls, function (targetUl) {
            if (link.dataset.ulId === targetUl.dataset.id || targetUl === ul) {
                targetUl.style.display = 'block';
                _this.fetchList(targetUl);
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
            utility_1.addClass(link, this.opt.collapseClass);
            link.addEventListener('click', function (e) {
                e.preventDefault();
                _this.backLink(link);
            });
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
    MultiMenu.prototype.setActiveMenu = function () {
        var _this = this;
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
    MultiMenu.prototype.setMenu = function (uls, offset) {
        var _this = this;
        if (offset === void 0) { offset = 0; }
        this.setLevels(uls, offset);
        this.flattenList(uls);
        var links = this.multiMenu.querySelectorAll("a:not(." + this.opt.collapseClass + ")");
        [].forEach.call(links, function (link) {
            _this.setLink(link);
        });
    };
    return MultiMenu;
}());
exports.default = MultiMenu;
//# sourceMappingURL=index.js.map