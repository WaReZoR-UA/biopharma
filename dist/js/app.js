(() => {
    var __webpack_modules__ = {
        158: function(module) {
            (function(global, factory) {
                if (true && module.exports) module.exports = factory(); else global.EvEmitter = factory();
            })("undefined" != typeof window ? window : this, (function() {
                function EvEmitter() {}
                let proto = EvEmitter.prototype;
                proto.on = function(eventName, listener) {
                    if (!eventName || !listener) return this;
                    let events = this._events = this._events || {};
                    let listeners = events[eventName] = events[eventName] || [];
                    if (!listeners.includes(listener)) listeners.push(listener);
                    return this;
                };
                proto.once = function(eventName, listener) {
                    if (!eventName || !listener) return this;
                    this.on(eventName, listener);
                    let onceEvents = this._onceEvents = this._onceEvents || {};
                    let onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};
                    onceListeners[listener] = true;
                    return this;
                };
                proto.off = function(eventName, listener) {
                    let listeners = this._events && this._events[eventName];
                    if (!listeners || !listeners.length) return this;
                    let index = listeners.indexOf(listener);
                    if (-1 != index) listeners.splice(index, 1);
                    return this;
                };
                proto.emitEvent = function(eventName, args) {
                    let listeners = this._events && this._events[eventName];
                    if (!listeners || !listeners.length) return this;
                    listeners = listeners.slice(0);
                    args = args || [];
                    let onceListeners = this._onceEvents && this._onceEvents[eventName];
                    for (let listener of listeners) {
                        let isOnce = onceListeners && onceListeners[listener];
                        if (isOnce) {
                            this.off(eventName, listener);
                            delete onceListeners[listener];
                        }
                        listener.apply(this, args);
                    }
                    return this;
                };
                proto.allOff = function() {
                    delete this._events;
                    delete this._onceEvents;
                    return this;
                };
                return EvEmitter;
            }));
        },
        47: function(module) {
            (function(global, factory) {
                if (true && module.exports) module.exports = factory(global); else global.fizzyUIUtils = factory(global);
            })(this, (function factory(global) {
                let utils = {};
                utils.extend = function(a, b) {
                    return Object.assign(a, b);
                };
                utils.modulo = function(num, div) {
                    return (num % div + div) % div;
                };
                utils.makeArray = function(obj) {
                    if (Array.isArray(obj)) return obj;
                    if (null === obj || void 0 === obj) return [];
                    let isArrayLike = "object" == typeof obj && "number" == typeof obj.length;
                    if (isArrayLike) return [ ...obj ];
                    return [ obj ];
                };
                utils.removeFrom = function(ary, obj) {
                    let index = ary.indexOf(obj);
                    if (-1 != index) ary.splice(index, 1);
                };
                utils.getParent = function(elem, selector) {
                    while (elem.parentNode && elem != document.body) {
                        elem = elem.parentNode;
                        if (elem.matches(selector)) return elem;
                    }
                };
                utils.getQueryElement = function(elem) {
                    if ("string" == typeof elem) return document.querySelector(elem);
                    return elem;
                };
                utils.handleEvent = function(event) {
                    let method = "on" + event.type;
                    if (this[method]) this[method](event);
                };
                utils.filterFindElements = function(elems, selector) {
                    elems = utils.makeArray(elems);
                    return elems.filter((elem => elem instanceof HTMLElement)).reduce(((ffElems, elem) => {
                        if (!selector) {
                            ffElems.push(elem);
                            return ffElems;
                        }
                        if (elem.matches(selector)) ffElems.push(elem);
                        let childElems = elem.querySelectorAll(selector);
                        ffElems = ffElems.concat(...childElems);
                        return ffElems;
                    }), []);
                };
                utils.debounceMethod = function(_class, methodName, threshold) {
                    threshold = threshold || 100;
                    let method = _class.prototype[methodName];
                    let timeoutName = methodName + "Timeout";
                    _class.prototype[methodName] = function() {
                        clearTimeout(this[timeoutName]);
                        let args = arguments;
                        this[timeoutName] = setTimeout((() => {
                            method.apply(this, args);
                            delete this[timeoutName];
                        }), threshold);
                    };
                };
                utils.docReady = function(onDocReady) {
                    let readyState = document.readyState;
                    if ("complete" == readyState || "interactive" == readyState) setTimeout(onDocReady); else document.addEventListener("DOMContentLoaded", onDocReady);
                };
                utils.toDashed = function(str) {
                    return str.replace(/(.)([A-Z])/g, (function(match, $1, $2) {
                        return $1 + "-" + $2;
                    })).toLowerCase();
                };
                let console = global.console;
                utils.htmlInit = function(WidgetClass, namespace) {
                    utils.docReady((function() {
                        let dashedNamespace = utils.toDashed(namespace);
                        let dataAttr = "data-" + dashedNamespace;
                        let dataAttrElems = document.querySelectorAll(`[${dataAttr}]`);
                        let jQuery = global.jQuery;
                        [ ...dataAttrElems ].forEach((elem => {
                            let attr = elem.getAttribute(dataAttr);
                            let options;
                            try {
                                options = attr && JSON.parse(attr);
                            } catch (error) {
                                if (console) console.error(`Error parsing ${dataAttr} on ${elem.className}: ${error}`);
                                return;
                            }
                            let instance = new WidgetClass(elem, options);
                            if (jQuery) jQuery.data(elem, namespace, instance);
                        }));
                    }));
                };
                return utils;
            }));
        },
        597: function(module, __unused_webpack_exports, __webpack_require__) {
            (function(window, factory) {
                if (true && module.exports) module.exports = factory(__webpack_require__(680), __webpack_require__(47)); else factory(window.Flickity, window.fizzyUIUtils);
            })("undefined" != typeof window ? window : this, (function factory(Flickity, utils) {
                function getCellsFragment(cells) {
                    let fragment = document.createDocumentFragment();
                    cells.forEach((cell => fragment.appendChild(cell.element)));
                    return fragment;
                }
                let proto = Flickity.prototype;
                proto.insert = function(elems, index) {
                    let cells = this._makeCells(elems);
                    if (!cells || !cells.length) return;
                    let len = this.cells.length;
                    index = void 0 === index ? len : index;
                    let fragment = getCellsFragment(cells);
                    let isAppend = index === len;
                    if (isAppend) this.slider.appendChild(fragment); else {
                        let insertCellElement = this.cells[index].element;
                        this.slider.insertBefore(fragment, insertCellElement);
                    }
                    if (0 === index) this.cells = cells.concat(this.cells); else if (isAppend) this.cells = this.cells.concat(cells); else {
                        let endCells = this.cells.splice(index, len - index);
                        this.cells = this.cells.concat(cells).concat(endCells);
                    }
                    this._sizeCells(cells);
                    this.cellChange(index);
                    this.positionSliderAtSelected();
                };
                proto.append = function(elems) {
                    this.insert(elems, this.cells.length);
                };
                proto.prepend = function(elems) {
                    this.insert(elems, 0);
                };
                proto.remove = function(elems) {
                    let cells = this.getCells(elems);
                    if (!cells || !cells.length) return;
                    let minCellIndex = this.cells.length - 1;
                    cells.forEach((cell => {
                        cell.remove();
                        let index = this.cells.indexOf(cell);
                        minCellIndex = Math.min(index, minCellIndex);
                        utils.removeFrom(this.cells, cell);
                    }));
                    this.cellChange(minCellIndex);
                    this.positionSliderAtSelected();
                };
                proto.cellSizeChange = function(elem) {
                    let cell = this.getCell(elem);
                    if (!cell) return;
                    cell.getSize();
                    let index = this.cells.indexOf(cell);
                    this.cellChange(index);
                };
                proto.cellChange = function(changedCellIndex) {
                    let prevSelectedElem = this.selectedElement;
                    this._positionCells(changedCellIndex);
                    this._updateWrapShiftCells();
                    this.setGallerySize();
                    let cell = this.getCell(prevSelectedElem);
                    if (cell) this.selectedIndex = this.getCellSlideIndex(cell);
                    this.selectedIndex = Math.min(this.slides.length - 1, this.selectedIndex);
                    this.emitEvent("cellChange", [ changedCellIndex ]);
                    this.select(this.selectedIndex);
                };
                return Flickity;
            }));
        },
        880: function(module, __unused_webpack_exports, __webpack_require__) {
            (function(window, factory) {
                if (true && module.exports) module.exports = factory(__webpack_require__(47)); else {
                    window.Flickity = window.Flickity || {};
                    window.Flickity.animatePrototype = factory(window.fizzyUIUtils);
                }
            })("undefined" != typeof window ? window : this, (function factory(utils) {
                let proto = {};
                proto.startAnimation = function() {
                    if (this.isAnimating) return;
                    this.isAnimating = true;
                    this.restingFrames = 0;
                    this.animate();
                };
                proto.animate = function() {
                    this.applyDragForce();
                    this.applySelectedAttraction();
                    let previousX = this.x;
                    this.integratePhysics();
                    this.positionSlider();
                    this.settle(previousX);
                    if (this.isAnimating) requestAnimationFrame((() => this.animate()));
                };
                proto.positionSlider = function() {
                    let x = this.x;
                    if (this.isWrapping) {
                        x = utils.modulo(x, this.slideableWidth) - this.slideableWidth;
                        this.shiftWrapCells(x);
                    }
                    this.setTranslateX(x, this.isAnimating);
                    this.dispatchScrollEvent();
                };
                proto.setTranslateX = function(x, is3d) {
                    x += this.cursorPosition;
                    if (this.options.rightToLeft) x = -x;
                    let translateX = this.getPositionValue(x);
                    this.slider.style.transform = is3d ? `translate3d(${translateX},0,0)` : `translateX(${translateX})`;
                };
                proto.dispatchScrollEvent = function() {
                    let firstSlide = this.slides[0];
                    if (!firstSlide) return;
                    let positionX = -this.x - firstSlide.target;
                    let progress = positionX / this.slidesWidth;
                    this.dispatchEvent("scroll", null, [ progress, positionX ]);
                };
                proto.positionSliderAtSelected = function() {
                    if (!this.cells.length) return;
                    this.x = -this.selectedSlide.target;
                    this.velocity = 0;
                    this.positionSlider();
                };
                proto.getPositionValue = function(position) {
                    if (this.options.percentPosition) return .01 * Math.round(position / this.size.innerWidth * 1e4) + "%"; else return Math.round(position) + "px";
                };
                proto.settle = function(previousX) {
                    let isResting = !this.isPointerDown && Math.round(100 * this.x) === Math.round(100 * previousX);
                    if (isResting) this.restingFrames++;
                    if (this.restingFrames > 2) {
                        this.isAnimating = false;
                        delete this.isFreeScrolling;
                        this.positionSlider();
                        this.dispatchEvent("settle", null, [ this.selectedIndex ]);
                    }
                };
                proto.shiftWrapCells = function(x) {
                    let beforeGap = this.cursorPosition + x;
                    this._shiftCells(this.beforeShiftCells, beforeGap, -1);
                    let afterGap = this.size.innerWidth - (x + this.slideableWidth + this.cursorPosition);
                    this._shiftCells(this.afterShiftCells, afterGap, 1);
                };
                proto._shiftCells = function(cells, gap, shift) {
                    cells.forEach((cell => {
                        let cellShift = gap > 0 ? shift : 0;
                        this._wrapShiftCell(cell, cellShift);
                        gap -= cell.size.outerWidth;
                    }));
                };
                proto._unshiftCells = function(cells) {
                    if (!cells || !cells.length) return;
                    cells.forEach((cell => this._wrapShiftCell(cell, 0)));
                };
                proto._wrapShiftCell = function(cell, shift) {
                    this._renderCellPosition(cell, cell.x + this.slideableWidth * shift);
                };
                proto.integratePhysics = function() {
                    this.x += this.velocity;
                    this.velocity *= this.getFrictionFactor();
                };
                proto.applyForce = function(force) {
                    this.velocity += force;
                };
                proto.getFrictionFactor = function() {
                    return 1 - this.options[this.isFreeScrolling ? "freeScrollFriction" : "friction"];
                };
                proto.getRestingPosition = function() {
                    return this.x + this.velocity / (1 - this.getFrictionFactor());
                };
                proto.applyDragForce = function() {
                    if (!this.isDraggable || !this.isPointerDown) return;
                    let dragVelocity = this.dragX - this.x;
                    let dragForce = dragVelocity - this.velocity;
                    this.applyForce(dragForce);
                };
                proto.applySelectedAttraction = function() {
                    let dragDown = this.isDraggable && this.isPointerDown;
                    if (dragDown || this.isFreeScrolling || !this.slides.length) return;
                    let distance = -1 * this.selectedSlide.target - this.x;
                    let force = distance * this.options.selectedAttraction;
                    this.applyForce(force);
                };
                return proto;
            }));
        },
        229: function(module, __unused_webpack_exports, __webpack_require__) {
            (function(window, factory) {
                if (true && module.exports) module.exports = factory(__webpack_require__(131)); else {
                    window.Flickity = window.Flickity || {};
                    window.Flickity.Cell = factory(window.getSize);
                }
            })("undefined" != typeof window ? window : this, (function factory(getSize) {
                const cellClassName = "flickity-cell";
                function Cell(elem) {
                    this.element = elem;
                    this.element.classList.add(cellClassName);
                    this.x = 0;
                    this.unselect();
                }
                let proto = Cell.prototype;
                proto.destroy = function() {
                    this.unselect();
                    this.element.classList.remove(cellClassName);
                    this.element.style.transform = "";
                    this.element.removeAttribute("aria-hidden");
                };
                proto.getSize = function() {
                    this.size = getSize(this.element);
                };
                proto.select = function() {
                    this.element.classList.add("is-selected");
                    this.element.removeAttribute("aria-hidden");
                };
                proto.unselect = function() {
                    this.element.classList.remove("is-selected");
                    this.element.setAttribute("aria-hidden", "true");
                };
                proto.remove = function() {
                    this.element.remove();
                };
                return Cell;
            }));
        },
        680: function(module, __unused_webpack_exports, __webpack_require__) {
            (function(window, factory) {
                if (true && module.exports) module.exports = factory(window, __webpack_require__(158), __webpack_require__(131), __webpack_require__(47), __webpack_require__(229), __webpack_require__(714), __webpack_require__(880)); else {
                    let _Flickity = window.Flickity;
                    window.Flickity = factory(window, window.EvEmitter, window.getSize, window.fizzyUIUtils, _Flickity.Cell, _Flickity.Slide, _Flickity.animatePrototype);
                }
            })("undefined" != typeof window ? window : this, (function factory(window, EvEmitter, getSize, utils, Cell, Slide, animatePrototype) {
                const {getComputedStyle, console} = window;
                let {jQuery} = window;
                let GUID = 0;
                let instances = {};
                function Flickity(element, options) {
                    let queryElement = utils.getQueryElement(element);
                    if (!queryElement) {
                        if (console) console.error(`Bad element for Flickity: ${queryElement || element}`);
                        return;
                    }
                    this.element = queryElement;
                    if (this.element.flickityGUID) {
                        let instance = instances[this.element.flickityGUID];
                        if (instance) instance.option(options);
                        return instance;
                    }
                    if (jQuery) this.$element = jQuery(this.element);
                    this.options = {
                        ...this.constructor.defaults
                    };
                    this.option(options);
                    this._create();
                }
                Flickity.defaults = {
                    accessibility: true,
                    cellAlign: "center",
                    freeScrollFriction: .075,
                    friction: .28,
                    namespaceJQueryEvents: true,
                    percentPosition: true,
                    resize: true,
                    selectedAttraction: .025,
                    setGallerySize: true
                };
                Flickity.create = {};
                let proto = Flickity.prototype;
                Object.assign(proto, EvEmitter.prototype);
                proto._create = function() {
                    let {resize, watchCSS, rightToLeft} = this.options;
                    let id = this.guid = ++GUID;
                    this.element.flickityGUID = id;
                    instances[id] = this;
                    this.selectedIndex = 0;
                    this.restingFrames = 0;
                    this.x = 0;
                    this.velocity = 0;
                    this.beginMargin = rightToLeft ? "marginRight" : "marginLeft";
                    this.endMargin = rightToLeft ? "marginLeft" : "marginRight";
                    this.viewport = document.createElement("div");
                    this.viewport.className = "flickity-viewport";
                    this._createSlider();
                    this.focusableElems = [ this.element ];
                    if (resize || watchCSS) window.addEventListener("resize", this);
                    for (let eventName in this.options.on) {
                        let listener = this.options.on[eventName];
                        this.on(eventName, listener);
                    }
                    for (let method in Flickity.create) Flickity.create[method].call(this);
                    if (watchCSS) this.watchCSS(); else this.activate();
                };
                proto.option = function(opts) {
                    Object.assign(this.options, opts);
                };
                proto.activate = function() {
                    if (this.isActive) return;
                    this.isActive = true;
                    this.element.classList.add("flickity-enabled");
                    if (this.options.rightToLeft) this.element.classList.add("flickity-rtl");
                    this.getSize();
                    let cellElems = this._filterFindCellElements(this.element.children);
                    this.slider.append(...cellElems);
                    this.viewport.append(this.slider);
                    this.element.append(this.viewport);
                    this.reloadCells();
                    if (this.options.accessibility) {
                        this.element.tabIndex = 0;
                        this.element.addEventListener("keydown", this);
                    }
                    this.emitEvent("activate");
                    this.selectInitialIndex();
                    this.isInitActivated = true;
                    this.dispatchEvent("ready");
                };
                proto._createSlider = function() {
                    let slider = document.createElement("div");
                    slider.className = "flickity-slider";
                    this.slider = slider;
                };
                proto._filterFindCellElements = function(elems) {
                    return utils.filterFindElements(elems, this.options.cellSelector);
                };
                proto.reloadCells = function() {
                    this.cells = this._makeCells(this.slider.children);
                    this.positionCells();
                    this._updateWrapShiftCells();
                    this.setGallerySize();
                };
                proto._makeCells = function(elems) {
                    let cellElems = this._filterFindCellElements(elems);
                    return cellElems.map((cellElem => new Cell(cellElem)));
                };
                proto.getLastCell = function() {
                    return this.cells[this.cells.length - 1];
                };
                proto.getLastSlide = function() {
                    return this.slides[this.slides.length - 1];
                };
                proto.positionCells = function() {
                    this._sizeCells(this.cells);
                    this._positionCells(0);
                };
                proto._positionCells = function(index) {
                    index = index || 0;
                    this.maxCellHeight = index ? this.maxCellHeight || 0 : 0;
                    let cellX = 0;
                    if (index > 0) {
                        let startCell = this.cells[index - 1];
                        cellX = startCell.x + startCell.size.outerWidth;
                    }
                    this.cells.slice(index).forEach((cell => {
                        cell.x = cellX;
                        this._renderCellPosition(cell, cellX);
                        cellX += cell.size.outerWidth;
                        this.maxCellHeight = Math.max(cell.size.outerHeight, this.maxCellHeight);
                    }));
                    this.slideableWidth = cellX;
                    this.updateSlides();
                    this._containSlides();
                    this.slidesWidth = this.cells.length ? this.getLastSlide().target - this.slides[0].target : 0;
                };
                proto._renderCellPosition = function(cell, x) {
                    let sideOffset = this.options.rightToLeft ? -1 : 1;
                    let renderX = x * sideOffset;
                    if (this.options.percentPosition) renderX *= this.size.innerWidth / cell.size.width;
                    let positionValue = this.getPositionValue(renderX);
                    cell.element.style.transform = `translateX( ${positionValue} )`;
                };
                proto._sizeCells = function(cells) {
                    cells.forEach((cell => cell.getSize()));
                };
                proto.updateSlides = function() {
                    this.slides = [];
                    if (!this.cells.length) return;
                    let {beginMargin, endMargin} = this;
                    let slide = new Slide(beginMargin, endMargin, this.cellAlign);
                    this.slides.push(slide);
                    let canCellFit = this._getCanCellFit();
                    this.cells.forEach(((cell, i) => {
                        if (!slide.cells.length) {
                            slide.addCell(cell);
                            return;
                        }
                        let slideWidth = slide.outerWidth - slide.firstMargin + (cell.size.outerWidth - cell.size[endMargin]);
                        if (canCellFit(i, slideWidth)) slide.addCell(cell); else {
                            slide.updateTarget();
                            slide = new Slide(beginMargin, endMargin, this.cellAlign);
                            this.slides.push(slide);
                            slide.addCell(cell);
                        }
                    }));
                    slide.updateTarget();
                    this.updateSelectedSlide();
                };
                proto._getCanCellFit = function() {
                    let {groupCells} = this.options;
                    if (!groupCells) return () => false;
                    if ("number" == typeof groupCells) {
                        let number = parseInt(groupCells, 10);
                        return i => i % number !== 0;
                    }
                    let percent = 1;
                    let percentMatch = "string" == typeof groupCells && groupCells.match(/^(\d+)%$/);
                    if (percentMatch) percent = parseInt(percentMatch[1], 10) / 100;
                    let groupWidth = (this.size.innerWidth + 1) * percent;
                    return (i, slideWidth) => slideWidth <= groupWidth;
                };
                proto._init = proto.reposition = function() {
                    this.positionCells();
                    this.positionSliderAtSelected();
                };
                proto.getSize = function() {
                    this.size = getSize(this.element);
                    this.setCellAlign();
                    this.cursorPosition = this.size.innerWidth * this.cellAlign;
                };
                let cellAlignShorthands = {
                    left: 0,
                    center: .5,
                    right: 1
                };
                proto.setCellAlign = function() {
                    let {cellAlign, rightToLeft} = this.options;
                    let shorthand = cellAlignShorthands[cellAlign];
                    this.cellAlign = void 0 !== shorthand ? shorthand : cellAlign;
                    if (rightToLeft) this.cellAlign = 1 - this.cellAlign;
                };
                proto.setGallerySize = function() {
                    if (!this.options.setGallerySize) return;
                    let height = this.options.adaptiveHeight && this.selectedSlide ? this.selectedSlide.height : this.maxCellHeight;
                    this.viewport.style.height = `${height}px`;
                };
                proto._updateWrapShiftCells = function() {
                    this.isWrapping = this.getIsWrapping();
                    if (!this.isWrapping) return;
                    this._unshiftCells(this.beforeShiftCells);
                    this._unshiftCells(this.afterShiftCells);
                    let beforeGapX = this.cursorPosition;
                    let lastIndex = this.cells.length - 1;
                    this.beforeShiftCells = this._getGapCells(beforeGapX, lastIndex, -1);
                    let afterGapX = this.size.innerWidth - this.cursorPosition;
                    this.afterShiftCells = this._getGapCells(afterGapX, 0, 1);
                };
                proto.getIsWrapping = function() {
                    let {wrapAround} = this.options;
                    if (!wrapAround || this.slides.length < 2) return false;
                    if ("fill" !== wrapAround) return true;
                    let gapWidth = this.slideableWidth - this.size.innerWidth;
                    if (gapWidth > this.size.innerWidth) return true;
                    for (let cell of this.cells) if (cell.size.outerWidth > gapWidth) return false;
                    return true;
                };
                proto._getGapCells = function(gapX, cellIndex, increment) {
                    let cells = [];
                    while (gapX > 0) {
                        let cell = this.cells[cellIndex];
                        if (!cell) break;
                        cells.push(cell);
                        cellIndex += increment;
                        gapX -= cell.size.outerWidth;
                    }
                    return cells;
                };
                proto._containSlides = function() {
                    let isContaining = this.options.contain && !this.isWrapping && this.cells.length;
                    if (!isContaining) return;
                    let contentWidth = this.slideableWidth - this.getLastCell().size[this.endMargin];
                    let isContentSmaller = contentWidth < this.size.innerWidth;
                    if (isContentSmaller) this.slides.forEach((slide => {
                        slide.target = contentWidth * this.cellAlign;
                    })); else {
                        let beginBound = this.cursorPosition + this.cells[0].size[this.beginMargin];
                        let endBound = contentWidth - this.size.innerWidth * (1 - this.cellAlign);
                        this.slides.forEach((slide => {
                            slide.target = Math.max(slide.target, beginBound);
                            slide.target = Math.min(slide.target, endBound);
                        }));
                    }
                };
                proto.dispatchEvent = function(type, event, args) {
                    let emitArgs = event ? [ event ].concat(args) : args;
                    this.emitEvent(type, emitArgs);
                    if (jQuery && this.$element) {
                        type += this.options.namespaceJQueryEvents ? ".flickity" : "";
                        let $event = type;
                        if (event) {
                            let jQEvent = new jQuery.Event(event);
                            jQEvent.type = type;
                            $event = jQEvent;
                        }
                        this.$element.trigger($event, args);
                    }
                };
                const unidraggerEvents = [ "dragStart", "dragMove", "dragEnd", "pointerDown", "pointerMove", "pointerEnd", "staticClick" ];
                let _emitEvent = proto.emitEvent;
                proto.emitEvent = function(eventName, args) {
                    if ("staticClick" === eventName) {
                        let clickedCell = this.getParentCell(args[0].target);
                        let cellElem = clickedCell && clickedCell.element;
                        let cellIndex = clickedCell && this.cells.indexOf(clickedCell);
                        args = args.concat(cellElem, cellIndex);
                    }
                    _emitEvent.call(this, eventName, args);
                    let isUnidraggerEvent = unidraggerEvents.includes(eventName);
                    if (!isUnidraggerEvent || !jQuery || !this.$element) return;
                    eventName += this.options.namespaceJQueryEvents ? ".flickity" : "";
                    let event = args.shift(0);
                    let jQEvent = new jQuery.Event(event);
                    jQEvent.type = eventName;
                    this.$element.trigger(jQEvent, args);
                };
                proto.select = function(index, isWrap, isInstant) {
                    if (!this.isActive) return;
                    index = parseInt(index, 10);
                    this._wrapSelect(index);
                    if (this.isWrapping || isWrap) index = utils.modulo(index, this.slides.length);
                    if (!this.slides[index]) return;
                    let prevIndex = this.selectedIndex;
                    this.selectedIndex = index;
                    this.updateSelectedSlide();
                    if (isInstant) this.positionSliderAtSelected(); else this.startAnimation();
                    if (this.options.adaptiveHeight) this.setGallerySize();
                    this.dispatchEvent("select", null, [ index ]);
                    if (index !== prevIndex) this.dispatchEvent("change", null, [ index ]);
                };
                proto._wrapSelect = function(index) {
                    if (!this.isWrapping) return;
                    const {selectedIndex, slideableWidth, slides: {length}} = this;
                    if (!this.isDragSelect) {
                        let wrapIndex = utils.modulo(index, length);
                        let delta = Math.abs(wrapIndex - selectedIndex);
                        let backWrapDelta = Math.abs(wrapIndex + length - selectedIndex);
                        let forewardWrapDelta = Math.abs(wrapIndex - length - selectedIndex);
                        if (backWrapDelta < delta) index += length; else if (forewardWrapDelta < delta) index -= length;
                    }
                    if (index < 0) this.x -= slideableWidth; else if (index >= length) this.x += slideableWidth;
                };
                proto.previous = function(isWrap, isInstant) {
                    this.select(this.selectedIndex - 1, isWrap, isInstant);
                };
                proto.next = function(isWrap, isInstant) {
                    this.select(this.selectedIndex + 1, isWrap, isInstant);
                };
                proto.updateSelectedSlide = function() {
                    let slide = this.slides[this.selectedIndex];
                    if (!slide) return;
                    this.unselectSelectedSlide();
                    this.selectedSlide = slide;
                    slide.select();
                    this.selectedCells = slide.cells;
                    this.selectedElements = slide.getCellElements();
                    this.selectedCell = slide.cells[0];
                    this.selectedElement = this.selectedElements[0];
                };
                proto.unselectSelectedSlide = function() {
                    if (this.selectedSlide) this.selectedSlide.unselect();
                };
                proto.selectInitialIndex = function() {
                    let initialIndex = this.options.initialIndex;
                    if (this.isInitActivated) {
                        this.select(this.selectedIndex, false, true);
                        return;
                    }
                    if (initialIndex && "string" == typeof initialIndex) {
                        let cell = this.queryCell(initialIndex);
                        if (cell) {
                            this.selectCell(initialIndex, false, true);
                            return;
                        }
                    }
                    let index = 0;
                    if (initialIndex && this.slides[initialIndex]) index = initialIndex;
                    this.select(index, false, true);
                };
                proto.selectCell = function(value, isWrap, isInstant) {
                    let cell = this.queryCell(value);
                    if (!cell) return;
                    let index = this.getCellSlideIndex(cell);
                    this.select(index, isWrap, isInstant);
                };
                proto.getCellSlideIndex = function(cell) {
                    let cellSlide = this.slides.find((slide => slide.cells.includes(cell)));
                    return this.slides.indexOf(cellSlide);
                };
                proto.getCell = function(elem) {
                    for (let cell of this.cells) if (cell.element === elem) return cell;
                };
                proto.getCells = function(elems) {
                    elems = utils.makeArray(elems);
                    return elems.map((elem => this.getCell(elem))).filter(Boolean);
                };
                proto.getCellElements = function() {
                    return this.cells.map((cell => cell.element));
                };
                proto.getParentCell = function(elem) {
                    let cell = this.getCell(elem);
                    if (cell) return cell;
                    let closest = elem.closest(".flickity-slider > *");
                    return this.getCell(closest);
                };
                proto.getAdjacentCellElements = function(adjCount, index) {
                    if (!adjCount) return this.selectedSlide.getCellElements();
                    index = void 0 === index ? this.selectedIndex : index;
                    let len = this.slides.length;
                    if (1 + 2 * adjCount >= len) return this.getCellElements();
                    let cellElems = [];
                    for (let i = index - adjCount; i <= index + adjCount; i++) {
                        let slideIndex = this.isWrapping ? utils.modulo(i, len) : i;
                        let slide = this.slides[slideIndex];
                        if (slide) cellElems = cellElems.concat(slide.getCellElements());
                    }
                    return cellElems;
                };
                proto.queryCell = function(selector) {
                    if ("number" == typeof selector) return this.cells[selector];
                    let isSelectorString = "string" == typeof selector && !selector.match(/^[#.]?[\d/]/);
                    if (isSelectorString) selector = this.element.querySelector(selector);
                    return this.getCell(selector);
                };
                proto.uiChange = function() {
                    this.emitEvent("uiChange");
                };
                proto.onresize = function() {
                    this.watchCSS();
                    this.resize();
                };
                utils.debounceMethod(Flickity, "onresize", 150);
                proto.resize = function() {
                    if (!this.isActive || this.isAnimating || this.isDragging) return;
                    this.getSize();
                    if (this.isWrapping) this.x = utils.modulo(this.x, this.slideableWidth);
                    this.positionCells();
                    this._updateWrapShiftCells();
                    this.setGallerySize();
                    this.emitEvent("resize");
                    let selectedElement = this.selectedElements && this.selectedElements[0];
                    this.selectCell(selectedElement, false, true);
                };
                proto.watchCSS = function() {
                    if (!this.options.watchCSS) return;
                    let afterContent = getComputedStyle(this.element, ":after").content;
                    if (afterContent.includes("flickity")) this.activate(); else this.deactivate();
                };
                proto.onkeydown = function(event) {
                    let {activeElement} = document;
                    let handler = Flickity.keyboardHandlers[event.key];
                    if (!this.options.accessibility || !activeElement || !handler) return;
                    let isFocused = this.focusableElems.some((elem => activeElement === elem));
                    if (isFocused) handler.call(this);
                };
                Flickity.keyboardHandlers = {
                    ArrowLeft: function() {
                        this.uiChange();
                        let leftMethod = this.options.rightToLeft ? "next" : "previous";
                        this[leftMethod]();
                    },
                    ArrowRight: function() {
                        this.uiChange();
                        let rightMethod = this.options.rightToLeft ? "previous" : "next";
                        this[rightMethod]();
                    }
                };
                proto.focus = function() {
                    this.element.focus({
                        preventScroll: true
                    });
                };
                proto.deactivate = function() {
                    if (!this.isActive) return;
                    this.element.classList.remove("flickity-enabled");
                    this.element.classList.remove("flickity-rtl");
                    this.unselectSelectedSlide();
                    this.cells.forEach((cell => cell.destroy()));
                    this.viewport.remove();
                    this.element.append(...this.slider.children);
                    if (this.options.accessibility) {
                        this.element.removeAttribute("tabIndex");
                        this.element.removeEventListener("keydown", this);
                    }
                    this.isActive = false;
                    this.emitEvent("deactivate");
                };
                proto.destroy = function() {
                    this.deactivate();
                    window.removeEventListener("resize", this);
                    this.allOff();
                    this.emitEvent("destroy");
                    if (jQuery && this.$element) jQuery.removeData(this.element, "flickity");
                    delete this.element.flickityGUID;
                    delete instances[this.guid];
                };
                Object.assign(proto, animatePrototype);
                Flickity.data = function(elem) {
                    elem = utils.getQueryElement(elem);
                    if (elem) return instances[elem.flickityGUID];
                };
                utils.htmlInit(Flickity, "flickity");
                let {jQueryBridget} = window;
                if (jQuery && jQueryBridget) jQueryBridget("flickity", Flickity, jQuery);
                Flickity.setJQuery = function(jq) {
                    jQuery = jq;
                };
                Flickity.Cell = Cell;
                Flickity.Slide = Slide;
                return Flickity;
            }));
        },
        690: function(module, __unused_webpack_exports, __webpack_require__) {
            (function(window, factory) {
                if (true && module.exports) module.exports = factory(window, __webpack_require__(680), __webpack_require__(842), __webpack_require__(47)); else window.Flickity = factory(window, window.Flickity, window.Unidragger, window.fizzyUIUtils);
            })("undefined" != typeof window ? window : this, (function factory(window, Flickity, Unidragger, utils) {
                Object.assign(Flickity.defaults, {
                    draggable: ">1",
                    dragThreshold: 3
                });
                let proto = Flickity.prototype;
                Object.assign(proto, Unidragger.prototype);
                proto.touchActionValue = "";
                Flickity.create.drag = function() {
                    this.on("activate", this.onActivateDrag);
                    this.on("uiChange", this._uiChangeDrag);
                    this.on("deactivate", this.onDeactivateDrag);
                    this.on("cellChange", this.updateDraggable);
                    this.on("pointerDown", this.handlePointerDown);
                    this.on("pointerUp", this.handlePointerUp);
                    this.on("pointerDown", this.handlePointerDone);
                    this.on("dragStart", this.handleDragStart);
                    this.on("dragMove", this.handleDragMove);
                    this.on("dragEnd", this.handleDragEnd);
                    this.on("staticClick", this.handleStaticClick);
                };
                proto.onActivateDrag = function() {
                    this.handles = [ this.viewport ];
                    this.bindHandles();
                    this.updateDraggable();
                };
                proto.onDeactivateDrag = function() {
                    this.unbindHandles();
                    this.element.classList.remove("is-draggable");
                };
                proto.updateDraggable = function() {
                    if (">1" === this.options.draggable) this.isDraggable = this.slides.length > 1; else this.isDraggable = this.options.draggable;
                    this.element.classList.toggle("is-draggable", this.isDraggable);
                };
                proto._uiChangeDrag = function() {
                    delete this.isFreeScrolling;
                };
                proto.handlePointerDown = function(event) {
                    if (!this.isDraggable) {
                        this.bindActivePointerEvents(event);
                        return;
                    }
                    let isTouchStart = "touchstart" === event.type;
                    let isTouchPointer = "touch" === event.pointerType;
                    let isFocusNode = event.target.matches("input, textarea, select");
                    if (!isTouchStart && !isTouchPointer && !isFocusNode) event.preventDefault();
                    if (!isFocusNode) this.focus();
                    if (document.activeElement !== this.element) document.activeElement.blur();
                    this.dragX = this.x;
                    this.viewport.classList.add("is-pointer-down");
                    this.pointerDownScroll = getScrollPosition();
                    window.addEventListener("scroll", this);
                    this.bindActivePointerEvents(event);
                };
                proto.hasDragStarted = function(moveVector) {
                    return Math.abs(moveVector.x) > this.options.dragThreshold;
                };
                proto.handlePointerUp = function() {
                    delete this.isTouchScrolling;
                    this.viewport.classList.remove("is-pointer-down");
                };
                proto.handlePointerDone = function() {
                    window.removeEventListener("scroll", this);
                    delete this.pointerDownScroll;
                };
                proto.handleDragStart = function() {
                    if (!this.isDraggable) return;
                    this.dragStartPosition = this.x;
                    this.startAnimation();
                    window.removeEventListener("scroll", this);
                };
                proto.handleDragMove = function(event, pointer, moveVector) {
                    if (!this.isDraggable) return;
                    event.preventDefault();
                    this.previousDragX = this.dragX;
                    let direction = this.options.rightToLeft ? -1 : 1;
                    if (this.isWrapping) moveVector.x %= this.slideableWidth;
                    let dragX = this.dragStartPosition + moveVector.x * direction;
                    if (!this.isWrapping) {
                        let originBound = Math.max(-this.slides[0].target, this.dragStartPosition);
                        dragX = dragX > originBound ? .5 * (dragX + originBound) : dragX;
                        let endBound = Math.min(-this.getLastSlide().target, this.dragStartPosition);
                        dragX = dragX < endBound ? .5 * (dragX + endBound) : dragX;
                    }
                    this.dragX = dragX;
                    this.dragMoveTime = new Date;
                };
                proto.handleDragEnd = function() {
                    if (!this.isDraggable) return;
                    let {freeScroll} = this.options;
                    if (freeScroll) this.isFreeScrolling = true;
                    let index = this.dragEndRestingSelect();
                    if (freeScroll && !this.isWrapping) {
                        let restingX = this.getRestingPosition();
                        this.isFreeScrolling = -restingX > this.slides[0].target && -restingX < this.getLastSlide().target;
                    } else if (!freeScroll && index === this.selectedIndex) index += this.dragEndBoostSelect();
                    delete this.previousDragX;
                    this.isDragSelect = this.isWrapping;
                    this.select(index);
                    delete this.isDragSelect;
                };
                proto.dragEndRestingSelect = function() {
                    let restingX = this.getRestingPosition();
                    let distance = Math.abs(this.getSlideDistance(-restingX, this.selectedIndex));
                    let positiveResting = this._getClosestResting(restingX, distance, 1);
                    let negativeResting = this._getClosestResting(restingX, distance, -1);
                    return positiveResting.distance < negativeResting.distance ? positiveResting.index : negativeResting.index;
                };
                proto._getClosestResting = function(restingX, distance, increment) {
                    let index = this.selectedIndex;
                    let minDistance = 1 / 0;
                    let condition = this.options.contain && !this.isWrapping ? (dist, minDist) => dist <= minDist : (dist, minDist) => dist < minDist;
                    while (condition(distance, minDistance)) {
                        index += increment;
                        minDistance = distance;
                        distance = this.getSlideDistance(-restingX, index);
                        if (null === distance) break;
                        distance = Math.abs(distance);
                    }
                    return {
                        distance: minDistance,
                        index: index - increment
                    };
                };
                proto.getSlideDistance = function(x, index) {
                    let len = this.slides.length;
                    let isWrapAround = this.options.wrapAround && len > 1;
                    let slideIndex = isWrapAround ? utils.modulo(index, len) : index;
                    let slide = this.slides[slideIndex];
                    if (!slide) return null;
                    let wrap = isWrapAround ? this.slideableWidth * Math.floor(index / len) : 0;
                    return x - (slide.target + wrap);
                };
                proto.dragEndBoostSelect = function() {
                    if (void 0 === this.previousDragX || !this.dragMoveTime || new Date - this.dragMoveTime > 100) return 0;
                    let distance = this.getSlideDistance(-this.dragX, this.selectedIndex);
                    let delta = this.previousDragX - this.dragX;
                    if (distance > 0 && delta > 0) return 1; else if (distance < 0 && delta < 0) return -1;
                    return 0;
                };
                proto.onscroll = function() {
                    let scroll = getScrollPosition();
                    let scrollMoveX = this.pointerDownScroll.x - scroll.x;
                    let scrollMoveY = this.pointerDownScroll.y - scroll.y;
                    if (Math.abs(scrollMoveX) > 3 || Math.abs(scrollMoveY) > 3) this.pointerDone();
                };
                function getScrollPosition() {
                    return {
                        x: window.pageXOffset,
                        y: window.pageYOffset
                    };
                }
                return Flickity;
            }));
        },
        835: function(module, __unused_webpack_exports, __webpack_require__) {
            (function(window, factory) {
                if (true && module.exports) module.exports = factory(__webpack_require__(680), __webpack_require__(564)); else factory(window.Flickity, window.imagesLoaded);
            })("undefined" != typeof window ? window : this, (function factory(Flickity, imagesLoaded) {
                Flickity.create.imagesLoaded = function() {
                    this.on("activate", this.imagesLoaded);
                };
                Flickity.prototype.imagesLoaded = function() {
                    if (!this.options.imagesLoaded) return;
                    let onImagesLoadedProgress = (instance, image) => {
                        let cell = this.getParentCell(image.img);
                        this.cellSizeChange(cell && cell.element);
                        if (!this.options.freeScroll) this.positionSliderAtSelected();
                    };
                    imagesLoaded(this.slider).on("progress", onImagesLoadedProgress);
                };
                return Flickity;
            }));
        },
        442: (module, __unused_webpack_exports, __webpack_require__) => {
            /*!
 * Flickity v3.0.0
 * Touch, responsive, flickable carousels
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * https://flickity.metafizzy.co
 * Copyright 2015-2022 Metafizzy
 */
            if (true && module.exports) {
                const Flickity = __webpack_require__(680);
                __webpack_require__(690);
                __webpack_require__(410);
                __webpack_require__(573);
                __webpack_require__(516);
                __webpack_require__(597);
                __webpack_require__(227);
                __webpack_require__(835);
                module.exports = Flickity;
            }
        },
        227: function(module, __unused_webpack_exports, __webpack_require__) {
            (function(window, factory) {
                if (true && module.exports) module.exports = factory(__webpack_require__(680), __webpack_require__(47)); else factory(window.Flickity, window.fizzyUIUtils);
            })("undefined" != typeof window ? window : this, (function factory(Flickity, utils) {
                const lazyAttr = "data-flickity-lazyload";
                const lazySrcAttr = `${lazyAttr}-src`;
                const lazySrcsetAttr = `${lazyAttr}-srcset`;
                const imgSelector = `img[${lazyAttr}], img[${lazySrcAttr}], ` + `img[${lazySrcsetAttr}], source[${lazySrcsetAttr}]`;
                Flickity.create.lazyLoad = function() {
                    this.on("select", this.lazyLoad);
                    this.handleLazyLoadComplete = this.onLazyLoadComplete.bind(this);
                };
                let proto = Flickity.prototype;
                proto.lazyLoad = function() {
                    let {lazyLoad} = this.options;
                    if (!lazyLoad) return;
                    let adjCount = "number" == typeof lazyLoad ? lazyLoad : 0;
                    this.getAdjacentCellElements(adjCount).map(getCellLazyImages).flat().forEach((img => new LazyLoader(img, this.handleLazyLoadComplete)));
                };
                function getCellLazyImages(cellElem) {
                    if (cellElem.matches("img")) {
                        let cellAttr = cellElem.getAttribute(lazyAttr);
                        let cellSrcAttr = cellElem.getAttribute(lazySrcAttr);
                        let cellSrcsetAttr = cellElem.getAttribute(lazySrcsetAttr);
                        if (cellAttr || cellSrcAttr || cellSrcsetAttr) return cellElem;
                    }
                    return [ ...cellElem.querySelectorAll(imgSelector) ];
                }
                proto.onLazyLoadComplete = function(img, event) {
                    let cell = this.getParentCell(img);
                    let cellElem = cell && cell.element;
                    this.cellSizeChange(cellElem);
                    this.dispatchEvent("lazyLoad", event, cellElem);
                };
                function LazyLoader(img, onComplete) {
                    this.img = img;
                    this.onComplete = onComplete;
                    this.load();
                }
                LazyLoader.prototype.handleEvent = utils.handleEvent;
                LazyLoader.prototype.load = function() {
                    this.img.addEventListener("load", this);
                    this.img.addEventListener("error", this);
                    let src = this.img.getAttribute(lazyAttr) || this.img.getAttribute(lazySrcAttr);
                    let srcset = this.img.getAttribute(lazySrcsetAttr);
                    this.img.src = src;
                    if (srcset) this.img.setAttribute("srcset", srcset);
                    this.img.removeAttribute(lazyAttr);
                    this.img.removeAttribute(lazySrcAttr);
                    this.img.removeAttribute(lazySrcsetAttr);
                };
                LazyLoader.prototype.onload = function(event) {
                    this.complete(event, "flickity-lazyloaded");
                };
                LazyLoader.prototype.onerror = function(event) {
                    this.complete(event, "flickity-lazyerror");
                };
                LazyLoader.prototype.complete = function(event, className) {
                    this.img.removeEventListener("load", this);
                    this.img.removeEventListener("error", this);
                    let mediaElem = this.img.parentNode.matches("picture") ? this.img.parentNode : this.img;
                    mediaElem.classList.add(className);
                    this.onComplete(this.img, event);
                };
                Flickity.LazyLoader = LazyLoader;
                return Flickity;
            }));
        },
        573: function(module, __unused_webpack_exports, __webpack_require__) {
            (function(window, factory) {
                if (true && module.exports) module.exports = factory(__webpack_require__(680), __webpack_require__(47)); else factory(window.Flickity, window.fizzyUIUtils);
            })("undefined" != typeof window ? window : this, (function factory(Flickity, utils) {
                function PageDots() {
                    this.holder = document.createElement("div");
                    this.holder.className = "flickity-page-dots";
                    this.dots = [];
                }
                PageDots.prototype.setDots = function(slidesLength) {
                    let delta = slidesLength - this.dots.length;
                    if (delta > 0) this.addDots(delta); else if (delta < 0) this.removeDots(-delta);
                };
                PageDots.prototype.addDots = function(count) {
                    let newDots = new Array(count).fill().map(((item, i) => {
                        let dot = document.createElement("button");
                        dot.setAttribute("type", "button");
                        let num = i + 1 + this.dots.length;
                        dot.className = "flickity-page-dot";
                        dot.textContent = `View slide ${num}`;
                        return dot;
                    }));
                    this.holder.append(...newDots);
                    this.dots = this.dots.concat(newDots);
                };
                PageDots.prototype.removeDots = function(count) {
                    let removeDots = this.dots.splice(this.dots.length - count, count);
                    removeDots.forEach((dot => dot.remove()));
                };
                PageDots.prototype.updateSelected = function(index) {
                    if (this.selectedDot) {
                        this.selectedDot.classList.remove("is-selected");
                        this.selectedDot.removeAttribute("aria-current");
                    }
                    if (!this.dots.length) return;
                    this.selectedDot = this.dots[index];
                    this.selectedDot.classList.add("is-selected");
                    this.selectedDot.setAttribute("aria-current", "step");
                };
                Flickity.PageDots = PageDots;
                Object.assign(Flickity.defaults, {
                    pageDots: true
                });
                Flickity.create.pageDots = function() {
                    if (!this.options.pageDots) return;
                    this.pageDots = new PageDots;
                    this.handlePageDotsClick = this.onPageDotsClick.bind(this);
                    this.on("activate", this.activatePageDots);
                    this.on("select", this.updateSelectedPageDots);
                    this.on("cellChange", this.updatePageDots);
                    this.on("resize", this.updatePageDots);
                    this.on("deactivate", this.deactivatePageDots);
                };
                let proto = Flickity.prototype;
                proto.activatePageDots = function() {
                    this.pageDots.setDots(this.slides.length);
                    this.focusableElems.push(...this.pageDots.dots);
                    this.pageDots.holder.addEventListener("click", this.handlePageDotsClick);
                    this.element.append(this.pageDots.holder);
                };
                proto.onPageDotsClick = function(event) {
                    let index = this.pageDots.dots.indexOf(event.target);
                    if (-1 === index) return;
                    this.uiChange();
                    this.select(index);
                };
                proto.updateSelectedPageDots = function() {
                    this.pageDots.updateSelected(this.selectedIndex);
                };
                proto.updatePageDots = function() {
                    this.pageDots.dots.forEach((dot => {
                        utils.removeFrom(this.focusableElems, dot);
                    }));
                    this.pageDots.setDots(this.slides.length);
                    this.focusableElems.push(...this.pageDots.dots);
                };
                proto.deactivatePageDots = function() {
                    this.pageDots.holder.remove();
                    this.pageDots.holder.removeEventListener("click", this.handlePageDotsClick);
                };
                Flickity.PageDots = PageDots;
                return Flickity;
            }));
        },
        516: function(module, __unused_webpack_exports, __webpack_require__) {
            (function(window, factory) {
                if (true && module.exports) module.exports = factory(__webpack_require__(680)); else factory(window.Flickity);
            })("undefined" != typeof window ? window : this, (function factory(Flickity) {
                function Player(autoPlay, onTick) {
                    this.autoPlay = autoPlay;
                    this.onTick = onTick;
                    this.state = "stopped";
                    this.onVisibilityChange = this.visibilityChange.bind(this);
                    this.onVisibilityPlay = this.visibilityPlay.bind(this);
                }
                Player.prototype.play = function() {
                    if ("playing" === this.state) return;
                    let isPageHidden = document.hidden;
                    if (isPageHidden) {
                        document.addEventListener("visibilitychange", this.onVisibilityPlay);
                        return;
                    }
                    this.state = "playing";
                    document.addEventListener("visibilitychange", this.onVisibilityChange);
                    this.tick();
                };
                Player.prototype.tick = function() {
                    if ("playing" !== this.state) return;
                    let time = "number" == typeof this.autoPlay ? this.autoPlay : 3e3;
                    this.clear();
                    this.timeout = setTimeout((() => {
                        this.onTick();
                        this.tick();
                    }), time);
                };
                Player.prototype.stop = function() {
                    this.state = "stopped";
                    this.clear();
                    document.removeEventListener("visibilitychange", this.onVisibilityChange);
                };
                Player.prototype.clear = function() {
                    clearTimeout(this.timeout);
                };
                Player.prototype.pause = function() {
                    if ("playing" === this.state) {
                        this.state = "paused";
                        this.clear();
                    }
                };
                Player.prototype.unpause = function() {
                    if ("paused" === this.state) this.play();
                };
                Player.prototype.visibilityChange = function() {
                    let isPageHidden = document.hidden;
                    this[isPageHidden ? "pause" : "unpause"]();
                };
                Player.prototype.visibilityPlay = function() {
                    this.play();
                    document.removeEventListener("visibilitychange", this.onVisibilityPlay);
                };
                Object.assign(Flickity.defaults, {
                    pauseAutoPlayOnHover: true
                });
                Flickity.create.player = function() {
                    this.player = new Player(this.options.autoPlay, (() => {
                        this.next(true);
                    }));
                    this.on("activate", this.activatePlayer);
                    this.on("uiChange", this.stopPlayer);
                    this.on("pointerDown", this.stopPlayer);
                    this.on("deactivate", this.deactivatePlayer);
                };
                let proto = Flickity.prototype;
                proto.activatePlayer = function() {
                    if (!this.options.autoPlay) return;
                    this.player.play();
                    this.element.addEventListener("mouseenter", this);
                };
                proto.playPlayer = function() {
                    this.player.play();
                };
                proto.stopPlayer = function() {
                    this.player.stop();
                };
                proto.pausePlayer = function() {
                    this.player.pause();
                };
                proto.unpausePlayer = function() {
                    this.player.unpause();
                };
                proto.deactivatePlayer = function() {
                    this.player.stop();
                    this.element.removeEventListener("mouseenter", this);
                };
                proto.onmouseenter = function() {
                    if (!this.options.pauseAutoPlayOnHover) return;
                    this.player.pause();
                    this.element.addEventListener("mouseleave", this);
                };
                proto.onmouseleave = function() {
                    this.player.unpause();
                    this.element.removeEventListener("mouseleave", this);
                };
                Flickity.Player = Player;
                return Flickity;
            }));
        },
        410: function(module, __unused_webpack_exports, __webpack_require__) {
            (function(window, factory) {
                if (true && module.exports) module.exports = factory(__webpack_require__(680)); else factory(window.Flickity);
            })("undefined" != typeof window ? window : this, (function factory(Flickity) {
                const svgURI = "http://www.w3.org/2000/svg";
                function PrevNextButton(increment, direction, arrowShape) {
                    this.increment = increment;
                    this.direction = direction;
                    this.isPrevious = "previous" === increment;
                    this.isLeft = "left" === direction;
                    this._create(arrowShape);
                }
                PrevNextButton.prototype._create = function(arrowShape) {
                    let element = this.element = document.createElement("button");
                    element.className = `flickity-button flickity-prev-next-button ${this.increment}`;
                    let label = this.isPrevious ? "Previous" : "Next";
                    element.setAttribute("type", "button");
                    element.setAttribute("aria-label", label);
                    this.disable();
                    let svg = this.createSVG(label, arrowShape);
                    element.append(svg);
                };
                PrevNextButton.prototype.createSVG = function(label, arrowShape) {
                    let svg = document.createElementNS(svgURI, "svg");
                    svg.setAttribute("class", "flickity-button-icon");
                    svg.setAttribute("viewBox", "0 0 100 100");
                    let title = document.createElementNS(svgURI, "title");
                    title.append(label);
                    let path = document.createElementNS(svgURI, "path");
                    let pathMovements = getArrowMovements(arrowShape);
                    path.setAttribute("d", pathMovements);
                    path.setAttribute("class", "arrow");
                    if (!this.isLeft) path.setAttribute("transform", "translate(100, 100) rotate(180)");
                    svg.append(title, path);
                    return svg;
                };
                function getArrowMovements(shape) {
                    if ("string" == typeof shape) return shape;
                    let {x0, x1, x2, x3, y1, y2} = shape;
                    return `M ${x0}, 50\n    L ${x1}, ${y1 + 50}\n    L ${x2}, ${y2 + 50}\n    L ${x3}, 50\n    L ${x2}, ${50 - y2}\n    L ${x1}, ${50 - y1}\n    Z`;
                }
                PrevNextButton.prototype.enable = function() {
                    this.element.removeAttribute("disabled");
                };
                PrevNextButton.prototype.disable = function() {
                    this.element.setAttribute("disabled", true);
                };
                Object.assign(Flickity.defaults, {
                    prevNextButtons: true,
                    arrowShape: {
                        x0: 10,
                        x1: 60,
                        y1: 50,
                        x2: 70,
                        y2: 40,
                        x3: 30
                    }
                });
                Flickity.create.prevNextButtons = function() {
                    if (!this.options.prevNextButtons) return;
                    let {rightToLeft, arrowShape} = this.options;
                    let prevDirection = rightToLeft ? "right" : "left";
                    let nextDirection = rightToLeft ? "left" : "right";
                    this.prevButton = new PrevNextButton("previous", prevDirection, arrowShape);
                    this.nextButton = new PrevNextButton("next", nextDirection, arrowShape);
                    this.focusableElems.push(this.prevButton.element);
                    this.focusableElems.push(this.nextButton.element);
                    this.handlePrevButtonClick = () => {
                        this.uiChange();
                        this.previous();
                    };
                    this.handleNextButtonClick = () => {
                        this.uiChange();
                        this.next();
                    };
                    this.on("activate", this.activatePrevNextButtons);
                    this.on("select", this.updatePrevNextButtons);
                };
                let proto = Flickity.prototype;
                proto.updatePrevNextButtons = function() {
                    let lastIndex = this.slides.length ? this.slides.length - 1 : 0;
                    this.updatePrevNextButton(this.prevButton, 0);
                    this.updatePrevNextButton(this.nextButton, lastIndex);
                };
                proto.updatePrevNextButton = function(button, disabledIndex) {
                    if (this.isWrapping && this.slides.length > 1) {
                        button.enable();
                        return;
                    }
                    let isEnabled = this.selectedIndex !== disabledIndex;
                    button[isEnabled ? "enable" : "disable"]();
                    let isDisabledFocused = !isEnabled && document.activeElement === button.element;
                    if (isDisabledFocused) this.focus();
                };
                proto.activatePrevNextButtons = function() {
                    this.prevButton.element.addEventListener("click", this.handlePrevButtonClick);
                    this.nextButton.element.addEventListener("click", this.handleNextButtonClick);
                    this.element.append(this.prevButton.element, this.nextButton.element);
                    this.on("deactivate", this.deactivatePrevNextButtons);
                };
                proto.deactivatePrevNextButtons = function() {
                    this.prevButton.element.remove();
                    this.nextButton.element.remove();
                    this.prevButton.element.removeEventListener("click", this.handlePrevButtonClick);
                    this.nextButton.element.removeEventListener("click", this.handleNextButtonClick);
                    this.off("deactivate", this.deactivatePrevNextButtons);
                };
                Flickity.PrevNextButton = PrevNextButton;
                return Flickity;
            }));
        },
        714: function(module) {
            (function(window, factory) {
                if (true && module.exports) module.exports = factory(); else {
                    window.Flickity = window.Flickity || {};
                    window.Flickity.Slide = factory();
                }
            })("undefined" != typeof window ? window : this, (function factory() {
                function Slide(beginMargin, endMargin, cellAlign) {
                    this.beginMargin = beginMargin;
                    this.endMargin = endMargin;
                    this.cellAlign = cellAlign;
                    this.cells = [];
                    this.outerWidth = 0;
                    this.height = 0;
                }
                let proto = Slide.prototype;
                proto.addCell = function(cell) {
                    this.cells.push(cell);
                    this.outerWidth += cell.size.outerWidth;
                    this.height = Math.max(cell.size.outerHeight, this.height);
                    if (1 === this.cells.length) {
                        this.x = cell.x;
                        this.firstMargin = cell.size[this.beginMargin];
                    }
                };
                proto.updateTarget = function() {
                    let lastCell = this.getLastCell();
                    let lastMargin = lastCell ? lastCell.size[this.endMargin] : 0;
                    let slideWidth = this.outerWidth - (this.firstMargin + lastMargin);
                    this.target = this.x + this.firstMargin + slideWidth * this.cellAlign;
                };
                proto.getLastCell = function() {
                    return this.cells[this.cells.length - 1];
                };
                proto.select = function() {
                    this.cells.forEach((cell => cell.select()));
                };
                proto.unselect = function() {
                    this.cells.forEach((cell => cell.unselect()));
                };
                proto.getCellElements = function() {
                    return this.cells.map((cell => cell.element));
                };
                return Slide;
            }));
        },
        131: module => {
            /*!
 * Infinite Scroll v2.0.4
 * measure size of elements
 * MIT license
 */
            (function(window, factory) {
                if (true && module.exports) module.exports = factory(); else window.getSize = factory();
            })(window, (function factory() {
                function getStyleSize(value) {
                    let num = parseFloat(value);
                    let isValid = -1 == value.indexOf("%") && !isNaN(num);
                    return isValid && num;
                }
                let measurements = [ "paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth" ];
                measurements.length;
                function getZeroSize() {
                    let size = {
                        width: 0,
                        height: 0,
                        innerWidth: 0,
                        innerHeight: 0,
                        outerWidth: 0,
                        outerHeight: 0
                    };
                    measurements.forEach((measurement => {
                        size[measurement] = 0;
                    }));
                    return size;
                }
                function getSize(elem) {
                    if ("string" == typeof elem) elem = document.querySelector(elem);
                    let isElement = elem && "object" == typeof elem && elem.nodeType;
                    if (!isElement) return;
                    let style = getComputedStyle(elem);
                    if ("none" == style.display) return getZeroSize();
                    let size = {};
                    size.width = elem.offsetWidth;
                    size.height = elem.offsetHeight;
                    let isBorderBox = size.isBorderBox = "border-box" == style.boxSizing;
                    measurements.forEach((measurement => {
                        let value = style[measurement];
                        let num = parseFloat(value);
                        size[measurement] = !isNaN(num) ? num : 0;
                    }));
                    let paddingWidth = size.paddingLeft + size.paddingRight;
                    let paddingHeight = size.paddingTop + size.paddingBottom;
                    let marginWidth = size.marginLeft + size.marginRight;
                    let marginHeight = size.marginTop + size.marginBottom;
                    let borderWidth = size.borderLeftWidth + size.borderRightWidth;
                    let borderHeight = size.borderTopWidth + size.borderBottomWidth;
                    let styleWidth = getStyleSize(style.width);
                    if (false !== styleWidth) size.width = styleWidth + (isBorderBox ? 0 : paddingWidth + borderWidth);
                    let styleHeight = getStyleSize(style.height);
                    if (false !== styleHeight) size.height = styleHeight + (isBorderBox ? 0 : paddingHeight + borderHeight);
                    size.innerWidth = size.width - (paddingWidth + borderWidth);
                    size.innerHeight = size.height - (paddingHeight + borderHeight);
                    size.outerWidth = size.width + marginWidth;
                    size.outerHeight = size.height + marginHeight;
                    return size;
                }
                return getSize;
            }));
        },
        564: function(module, __unused_webpack_exports, __webpack_require__) {
            /*!
 * imagesLoaded v5.0.0
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
            (function(window, factory) {
                if (true && module.exports) module.exports = factory(window, __webpack_require__(158)); else window.imagesLoaded = factory(window, window.EvEmitter);
            })("undefined" !== typeof window ? window : this, (function factory(window, EvEmitter) {
                let $ = window.jQuery;
                let console = window.console;
                function makeArray(obj) {
                    if (Array.isArray(obj)) return obj;
                    let isArrayLike = "object" == typeof obj && "number" == typeof obj.length;
                    if (isArrayLike) return [ ...obj ];
                    return [ obj ];
                }
                function ImagesLoaded(elem, options, onAlways) {
                    if (!(this instanceof ImagesLoaded)) return new ImagesLoaded(elem, options, onAlways);
                    let queryElem = elem;
                    if ("string" == typeof elem) queryElem = document.querySelectorAll(elem);
                    if (!queryElem) {
                        console.error(`Bad element for imagesLoaded ${queryElem || elem}`);
                        return;
                    }
                    this.elements = makeArray(queryElem);
                    this.options = {};
                    if ("function" == typeof options) onAlways = options; else Object.assign(this.options, options);
                    if (onAlways) this.on("always", onAlways);
                    this.getImages();
                    if ($) this.jqDeferred = new $.Deferred;
                    setTimeout(this.check.bind(this));
                }
                ImagesLoaded.prototype = Object.create(EvEmitter.prototype);
                ImagesLoaded.prototype.getImages = function() {
                    this.images = [];
                    this.elements.forEach(this.addElementImages, this);
                };
                const elementNodeTypes = [ 1, 9, 11 ];
                ImagesLoaded.prototype.addElementImages = function(elem) {
                    if ("IMG" === elem.nodeName) this.addImage(elem);
                    if (true === this.options.background) this.addElementBackgroundImages(elem);
                    let {nodeType} = elem;
                    if (!nodeType || !elementNodeTypes.includes(nodeType)) return;
                    let childImgs = elem.querySelectorAll("img");
                    for (let img of childImgs) this.addImage(img);
                    if ("string" == typeof this.options.background) {
                        let children = elem.querySelectorAll(this.options.background);
                        for (let child of children) this.addElementBackgroundImages(child);
                    }
                };
                const reURL = /url\((['"])?(.*?)\1\)/gi;
                ImagesLoaded.prototype.addElementBackgroundImages = function(elem) {
                    let style = getComputedStyle(elem);
                    if (!style) return;
                    let matches = reURL.exec(style.backgroundImage);
                    while (null !== matches) {
                        let url = matches && matches[2];
                        if (url) this.addBackground(url, elem);
                        matches = reURL.exec(style.backgroundImage);
                    }
                };
                ImagesLoaded.prototype.addImage = function(img) {
                    let loadingImage = new LoadingImage(img);
                    this.images.push(loadingImage);
                };
                ImagesLoaded.prototype.addBackground = function(url, elem) {
                    let background = new Background(url, elem);
                    this.images.push(background);
                };
                ImagesLoaded.prototype.check = function() {
                    this.progressedCount = 0;
                    this.hasAnyBroken = false;
                    if (!this.images.length) {
                        this.complete();
                        return;
                    }
                    let onProgress = (image, elem, message) => {
                        setTimeout((() => {
                            this.progress(image, elem, message);
                        }));
                    };
                    this.images.forEach((function(loadingImage) {
                        loadingImage.once("progress", onProgress);
                        loadingImage.check();
                    }));
                };
                ImagesLoaded.prototype.progress = function(image, elem, message) {
                    this.progressedCount++;
                    this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
                    this.emitEvent("progress", [ this, image, elem ]);
                    if (this.jqDeferred && this.jqDeferred.notify) this.jqDeferred.notify(this, image);
                    if (this.progressedCount === this.images.length) this.complete();
                    if (this.options.debug && console) console.log(`progress: ${message}`, image, elem);
                };
                ImagesLoaded.prototype.complete = function() {
                    let eventName = this.hasAnyBroken ? "fail" : "done";
                    this.isComplete = true;
                    this.emitEvent(eventName, [ this ]);
                    this.emitEvent("always", [ this ]);
                    if (this.jqDeferred) {
                        let jqMethod = this.hasAnyBroken ? "reject" : "resolve";
                        this.jqDeferred[jqMethod](this);
                    }
                };
                function LoadingImage(img) {
                    this.img = img;
                }
                LoadingImage.prototype = Object.create(EvEmitter.prototype);
                LoadingImage.prototype.check = function() {
                    let isComplete = this.getIsImageComplete();
                    if (isComplete) {
                        this.confirm(0 !== this.img.naturalWidth, "naturalWidth");
                        return;
                    }
                    this.proxyImage = new Image;
                    if (this.img.crossOrigin) this.proxyImage.crossOrigin = this.img.crossOrigin;
                    this.proxyImage.addEventListener("load", this);
                    this.proxyImage.addEventListener("error", this);
                    this.img.addEventListener("load", this);
                    this.img.addEventListener("error", this);
                    this.proxyImage.src = this.img.currentSrc || this.img.src;
                };
                LoadingImage.prototype.getIsImageComplete = function() {
                    return this.img.complete && this.img.naturalWidth;
                };
                LoadingImage.prototype.confirm = function(isLoaded, message) {
                    this.isLoaded = isLoaded;
                    let {parentNode} = this.img;
                    let elem = "PICTURE" === parentNode.nodeName ? parentNode : this.img;
                    this.emitEvent("progress", [ this, elem, message ]);
                };
                LoadingImage.prototype.handleEvent = function(event) {
                    let method = "on" + event.type;
                    if (this[method]) this[method](event);
                };
                LoadingImage.prototype.onload = function() {
                    this.confirm(true, "onload");
                    this.unbindEvents();
                };
                LoadingImage.prototype.onerror = function() {
                    this.confirm(false, "onerror");
                    this.unbindEvents();
                };
                LoadingImage.prototype.unbindEvents = function() {
                    this.proxyImage.removeEventListener("load", this);
                    this.proxyImage.removeEventListener("error", this);
                    this.img.removeEventListener("load", this);
                    this.img.removeEventListener("error", this);
                };
                function Background(url, element) {
                    this.url = url;
                    this.element = element;
                    this.img = new Image;
                }
                Background.prototype = Object.create(LoadingImage.prototype);
                Background.prototype.check = function() {
                    this.img.addEventListener("load", this);
                    this.img.addEventListener("error", this);
                    this.img.src = this.url;
                    let isComplete = this.getIsImageComplete();
                    if (isComplete) {
                        this.confirm(0 !== this.img.naturalWidth, "naturalWidth");
                        this.unbindEvents();
                    }
                };
                Background.prototype.unbindEvents = function() {
                    this.img.removeEventListener("load", this);
                    this.img.removeEventListener("error", this);
                };
                Background.prototype.confirm = function(isLoaded, message) {
                    this.isLoaded = isLoaded;
                    this.emitEvent("progress", [ this, this.element, message ]);
                };
                ImagesLoaded.makeJQueryPlugin = function(jQuery) {
                    jQuery = jQuery || window.jQuery;
                    if (!jQuery) return;
                    $ = jQuery;
                    $.fn.imagesLoaded = function(options, onAlways) {
                        let instance = new ImagesLoaded(this, options, onAlways);
                        return instance.jqDeferred.promise($(this));
                    };
                };
                ImagesLoaded.makeJQueryPlugin();
                return ImagesLoaded;
            }));
        },
        842: function(module, __unused_webpack_exports, __webpack_require__) {
            /*!
 * Unidragger v3.0.1
 * Draggable base class
 * MIT license
 */
            (function(window, factory) {
                if (true && module.exports) module.exports = factory(window, __webpack_require__(158)); else window.Unidragger = factory(window, window.EvEmitter);
            })("undefined" != typeof window ? window : this, (function factory(window, EvEmitter) {
                function Unidragger() {}
                let proto = Unidragger.prototype = Object.create(EvEmitter.prototype);
                proto.handleEvent = function(event) {
                    let method = "on" + event.type;
                    if (this[method]) this[method](event);
                };
                let startEvent, activeEvents;
                if ("ontouchstart" in window) {
                    startEvent = "touchstart";
                    activeEvents = [ "touchmove", "touchend", "touchcancel" ];
                } else if (window.PointerEvent) {
                    startEvent = "pointerdown";
                    activeEvents = [ "pointermove", "pointerup", "pointercancel" ];
                } else {
                    startEvent = "mousedown";
                    activeEvents = [ "mousemove", "mouseup" ];
                }
                proto.touchActionValue = "none";
                proto.bindHandles = function() {
                    this._bindHandles("addEventListener", this.touchActionValue);
                };
                proto.unbindHandles = function() {
                    this._bindHandles("removeEventListener", "");
                };
                proto._bindHandles = function(bindMethod, touchAction) {
                    this.handles.forEach((handle => {
                        handle[bindMethod](startEvent, this);
                        handle[bindMethod]("click", this);
                        if (window.PointerEvent) handle.style.touchAction = touchAction;
                    }));
                };
                proto.bindActivePointerEvents = function() {
                    activeEvents.forEach((eventName => {
                        window.addEventListener(eventName, this);
                    }));
                };
                proto.unbindActivePointerEvents = function() {
                    activeEvents.forEach((eventName => {
                        window.removeEventListener(eventName, this);
                    }));
                };
                proto.withPointer = function(methodName, event) {
                    if (event.pointerId === this.pointerIdentifier) this[methodName](event, event);
                };
                proto.withTouch = function(methodName, event) {
                    let touch;
                    for (let changedTouch of event.changedTouches) if (changedTouch.identifier === this.pointerIdentifier) touch = changedTouch;
                    if (touch) this[methodName](event, touch);
                };
                proto.onmousedown = function(event) {
                    this.pointerDown(event, event);
                };
                proto.ontouchstart = function(event) {
                    this.pointerDown(event, event.changedTouches[0]);
                };
                proto.onpointerdown = function(event) {
                    this.pointerDown(event, event);
                };
                const cursorNodes = [ "TEXTAREA", "INPUT", "SELECT", "OPTION" ];
                const clickTypes = [ "radio", "checkbox", "button", "submit", "image", "file" ];
                proto.pointerDown = function(event, pointer) {
                    let isCursorNode = cursorNodes.includes(event.target.nodeName);
                    let isClickType = clickTypes.includes(event.target.type);
                    let isOkayElement = !isCursorNode || isClickType;
                    let isOkay = !this.isPointerDown && !event.button && isOkayElement;
                    if (!isOkay) return;
                    this.isPointerDown = true;
                    this.pointerIdentifier = void 0 !== pointer.pointerId ? pointer.pointerId : pointer.identifier;
                    this.pointerDownPointer = {
                        pageX: pointer.pageX,
                        pageY: pointer.pageY
                    };
                    this.bindActivePointerEvents();
                    this.emitEvent("pointerDown", [ event, pointer ]);
                };
                proto.onmousemove = function(event) {
                    this.pointerMove(event, event);
                };
                proto.onpointermove = function(event) {
                    this.withPointer("pointerMove", event);
                };
                proto.ontouchmove = function(event) {
                    this.withTouch("pointerMove", event);
                };
                proto.pointerMove = function(event, pointer) {
                    let moveVector = {
                        x: pointer.pageX - this.pointerDownPointer.pageX,
                        y: pointer.pageY - this.pointerDownPointer.pageY
                    };
                    this.emitEvent("pointerMove", [ event, pointer, moveVector ]);
                    let isDragStarting = !this.isDragging && this.hasDragStarted(moveVector);
                    if (isDragStarting) this.dragStart(event, pointer);
                    if (this.isDragging) this.dragMove(event, pointer, moveVector);
                };
                proto.hasDragStarted = function(moveVector) {
                    return Math.abs(moveVector.x) > 3 || Math.abs(moveVector.y) > 3;
                };
                proto.dragStart = function(event, pointer) {
                    this.isDragging = true;
                    this.isPreventingClicks = true;
                    this.emitEvent("dragStart", [ event, pointer ]);
                };
                proto.dragMove = function(event, pointer, moveVector) {
                    this.emitEvent("dragMove", [ event, pointer, moveVector ]);
                };
                proto.onmouseup = function(event) {
                    this.pointerUp(event, event);
                };
                proto.onpointerup = function(event) {
                    this.withPointer("pointerUp", event);
                };
                proto.ontouchend = function(event) {
                    this.withTouch("pointerUp", event);
                };
                proto.pointerUp = function(event, pointer) {
                    this.pointerDone();
                    this.emitEvent("pointerUp", [ event, pointer ]);
                    if (this.isDragging) this.dragEnd(event, pointer); else this.staticClick(event, pointer);
                };
                proto.dragEnd = function(event, pointer) {
                    this.isDragging = false;
                    setTimeout((() => delete this.isPreventingClicks));
                    this.emitEvent("dragEnd", [ event, pointer ]);
                };
                proto.pointerDone = function() {
                    this.isPointerDown = false;
                    delete this.pointerIdentifier;
                    this.unbindActivePointerEvents();
                    this.emitEvent("pointerDone");
                };
                proto.onpointercancel = function(event) {
                    this.withPointer("pointerCancel", event);
                };
                proto.ontouchcancel = function(event) {
                    this.withTouch("pointerCancel", event);
                };
                proto.pointerCancel = function(event, pointer) {
                    this.pointerDone();
                    this.emitEvent("pointerCancel", [ event, pointer ]);
                };
                proto.onclick = function(event) {
                    if (this.isPreventingClicks) event.preventDefault();
                };
                proto.staticClick = function(event, pointer) {
                    let isMouseup = "mouseup" === event.type;
                    if (isMouseup && this.isIgnoringMouseUp) return;
                    this.emitEvent("staticClick", [ event, pointer ]);
                    if (isMouseup) {
                        this.isIgnoringMouseUp = true;
                        setTimeout((() => {
                            delete this.isIgnoringMouseUp;
                        }), 400);
                    }
                };
                return Unidragger;
            }));
        }
    };
    var __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        return module.exports;
    }
    (() => {
        "use strict";
        const flsModules = {};
        function isWebp() {
            function testWebP(callback) {
                let webP = new Image;
                webP.onload = webP.onerror = function() {
                    callback(2 == webP.height);
                };
                webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
            }
            testWebP((function(support) {
                let className = true === support ? "webp" : "no-webp";
                document.documentElement.classList.add(className);
            }));
        }
        let isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
            }
        };
        function fullVHfix() {
            const fullScreens = document.querySelectorAll("[data-fullscreen]");
            if (fullScreens.length && isMobile.any()) {
                window.addEventListener("resize", fixHeight);
                function fixHeight() {
                    let vh = .01 * window.innerHeight;
                    document.documentElement.style.setProperty("--vh", `${vh}px`);
                }
                fixHeight();
            }
        }
        let bodyLockStatus = true;
        let bodyUnlock = (delay = 500) => {
            let body = document.querySelector("body");
            if (bodyLockStatus) {
                let lock_padding = document.querySelectorAll("[data-lp]");
                setTimeout((() => {
                    for (let index = 0; index < lock_padding.length; index++) {
                        const el = lock_padding[index];
                        el.style.paddingRight = "0px";
                    }
                    body.style.paddingRight = "0px";
                    document.documentElement.classList.remove("lock");
                }), delay);
                bodyLockStatus = false;
                setTimeout((function() {
                    bodyLockStatus = true;
                }), delay);
            }
        };
        let bodyLock = (delay = 500) => {
            let body = document.querySelector("body");
            if (bodyLockStatus) {
                let lock_padding = document.querySelectorAll("[data-lp]");
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
                }
                body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
                document.documentElement.classList.add("lock");
                bodyLockStatus = false;
                setTimeout((function() {
                    bodyLockStatus = true;
                }), delay);
            }
        };
        function FLS(message) {
            setTimeout((() => {
                if (window.FLS) console.log(message);
            }), 0);
        }
        function validatePhone() {
            let phoneInputs = document.querySelectorAll("input[data-tel]");
            if (phoneInputs.length) {
                let getInputNumberOnly = function(input) {
                    return input.value.replace(/\D/g, "");
                };
                const onPhoneInput = function(e) {
                    const input = e.target;
                    const inputNumbersValue = getInputNumberOnly(input);
                    let formattedInputValue = "";
                    let selectionStart = input.selectionStart;
                    if (!inputNumbersValue) return input.value = "";
                    if (input.value.length != selectionStart) {
                        if (e.data && /\D/g.test(e.data)) input.value = inputNumbersValue;
                        return;
                    }
                    formattedInputValue = "+3 80 " + inputNumbersValue.substring(3, 5);
                    if (inputNumbersValue.length > 5) formattedInputValue += " " + inputNumbersValue.substring(5, 8);
                    if (inputNumbersValue.length > 8) formattedInputValue += " " + inputNumbersValue.substring(8, 10);
                    if (inputNumbersValue.length > 10) formattedInputValue += " " + inputNumbersValue.substring(10, 12);
                    input.value = formattedInputValue;
                };
                const onPhoneKeyDown = function(e) {
                    const input = e.target;
                    if (8 == e.keyCode && 3 == getInputNumberOnly(input).length) input.value = "";
                };
                const onPhonePaste = function(e) {
                    let pasted = e.clipboardData || window.clipboardData;
                    let input = e.target;
                    let inputNumberValue = getInputNumberOnly(input);
                    if (pasted) {
                        let pastedText = pasted.getData("Text");
                        if (/\D/g.test(pastedText)) input.value = inputNumberValue;
                    }
                };
                phoneInputs.forEach((input => {
                    input.addEventListener("input", onPhoneInput);
                    input.addEventListener("keydown", onPhoneKeyDown);
                    input.addEventListener("paste", onPhonePaste);
                }));
            }
        }
        class Popup {
            constructor(options) {
                let config = {
                    logging: true,
                    init: true,
                    attributeOpenButton: "data-popup",
                    attributeCloseButton: "data-close",
                    fixElementSelector: "[data-lp]",
                    youtubeAttribute: "data-popup-youtube",
                    youtubePlaceAttribute: "data-popup-youtube-place",
                    setAutoplayYoutube: true,
                    classes: {
                        popup: "popup",
                        popupContent: "popup__content",
                        popupActive: "popup_show",
                        bodyActive: "popup-show"
                    },
                    focusCatch: true,
                    closeEsc: true,
                    bodyLock: true,
                    hashSettings: {
                        location: true,
                        goHash: true
                    },
                    on: {
                        beforeOpen: function() {},
                        afterOpen: function() {},
                        beforeClose: function() {},
                        afterClose: function() {}
                    }
                };
                this.youTubeCode;
                this.isOpen = false;
                this.targetOpen = {
                    selector: false,
                    element: false
                };
                this.previousOpen = {
                    selector: false,
                    element: false
                };
                this.lastClosed = {
                    selector: false,
                    element: false
                };
                this._dataValue = false;
                this.hash = false;
                this._reopen = false;
                this._selectorOpen = false;
                this.lastFocusEl = false;
                this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
                this.options = {
                    ...config,
                    ...options,
                    classes: {
                        ...config.classes,
                        ...options?.classes
                    },
                    hashSettings: {
                        ...config.hashSettings,
                        ...options?.hashSettings
                    },
                    on: {
                        ...config.on,
                        ...options?.on
                    }
                };
                this.bodyLock = false;
                this.options.init ? this.initPopups() : null;
            }
            initPopups() {
                this.popupLogging(`Прокинувся`);
                this.eventsPopup();
            }
            eventsPopup() {
                document.addEventListener("click", function(e) {
                    const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                    if (buttonOpen) {
                        e.preventDefault();
                        this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                        this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                        if ("error" !== this._dataValue) {
                            if (!this.isOpen) this.lastFocusEl = buttonOpen;
                            this.targetOpen.selector = `${this._dataValue}`;
                            this._selectorOpen = true;
                            this.open();
                            return;
                        } else this.popupLogging(`Йой, не заповнено атрибут у ${buttonOpen.classList}`);
                        return;
                    }
                    const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                    if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                        e.preventDefault();
                        this.close();
                        return;
                    }
                }.bind(this));
                document.addEventListener("keydown", function(e) {
                    if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                        e.preventDefault();
                        this.close();
                        return;
                    }
                    if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                        this._focusCatch(e);
                        return;
                    }
                }.bind(this));
                if (this.options.hashSettings.goHash) {
                    window.addEventListener("hashchange", function() {
                        if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                    }.bind(this));
                    window.addEventListener("load", function() {
                        if (window.location.hash) this._openToHash();
                    }.bind(this));
                }
            }
            open(selectorValue) {
                if (bodyLockStatus) {
                    this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                    if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                        this.targetOpen.selector = selectorValue;
                        this._selectorOpen = true;
                    }
                    if (this.isOpen) {
                        this._reopen = true;
                        this.close();
                    }
                    if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                    if (!this._reopen) this.previousActiveElement = document.activeElement;
                    this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                    if (this.targetOpen.element) {
                        if (this.youTubeCode) {
                            const codeVideo = this.youTubeCode;
                            const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                            const iframe = document.createElement("iframe");
                            iframe.setAttribute("allowfullscreen", "");
                            const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                            iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                            iframe.setAttribute("src", urlVideo);
                            if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                                this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                            }
                            this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                        }
                        if (this.options.hashSettings.location) {
                            this._getHash();
                            this._setHash();
                        }
                        this.options.on.beforeOpen(this);
                        document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                            detail: {
                                popup: this
                            }
                        }));
                        this.targetOpen.element.classList.add(this.options.classes.popupActive);
                        document.documentElement.classList.add(this.options.classes.bodyActive);
                        if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                        this.targetOpen.element.setAttribute("aria-hidden", "false");
                        this.previousOpen.selector = this.targetOpen.selector;
                        this.previousOpen.element = this.targetOpen.element;
                        this._selectorOpen = false;
                        this.isOpen = true;
                        setTimeout((() => {
                            this._focusTrap();
                        }), 50);
                        this.options.on.afterOpen(this);
                        document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                            detail: {
                                popup: this
                            }
                        }));
                        this.popupLogging(`Відкрив попап`);
                    } else this.popupLogging(`Йой, такого попапу немає. Перевірте коректність введення. `);
                }
            }
            close(selectorValue) {
                if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
                if (!this.isOpen || !bodyLockStatus) return;
                this.options.on.beforeClose(this);
                document.dispatchEvent(new CustomEvent("beforePopupClose", {
                    detail: {
                        popup: this
                    }
                }));
                if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
                this.previousOpen.element.classList.remove(this.options.classes.popupActive);
                this.previousOpen.element.setAttribute("aria-hidden", "true");
                if (!this._reopen) {
                    document.documentElement.classList.remove(this.options.classes.bodyActive);
                    !this.bodyLock ? bodyUnlock() : null;
                    this.isOpen = false;
                }
                this._removeHash();
                if (this._selectorOpen) {
                    this.lastClosed.selector = this.previousOpen.selector;
                    this.lastClosed.element = this.previousOpen.element;
                }
                this.options.on.afterClose(this);
                document.dispatchEvent(new CustomEvent("afterPopupClose", {
                    detail: {
                        popup: this
                    }
                }));
                setTimeout((() => {
                    this._focusTrap();
                }), 50);
                this.popupLogging(`Закрив попап`);
            }
            _getHash() {
                if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
            }
            _openToHash() {
                let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
                const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
                this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ? buttons.getAttribute(this.options.youtubeAttribute) : null;
                if (buttons && classInHash) this.open(classInHash);
            }
            _setHash() {
                history.pushState("", "", this.hash);
            }
            _removeHash() {
                history.pushState("", "", window.location.href.split("#")[0]);
            }
            _focusCatch(e) {
                const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
                const focusArray = Array.prototype.slice.call(focusable);
                const focusedIndex = focusArray.indexOf(document.activeElement);
                if (e.shiftKey && 0 === focusedIndex) {
                    focusArray[focusArray.length - 1].focus();
                    e.preventDefault();
                }
                if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                    focusArray[0].focus();
                    e.preventDefault();
                }
            }
            _focusTrap() {
                const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
                if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
            }
            popupLogging(message) {
                this.options.logging ? FLS(`[Попапос]: ${message}`) : null;
            }
        }
        flsModules.popup = new Popup({});
        function formFieldsInit(options = {
            viewPass: false,
            autoHeight: false
        }) {
            const formFields = document.querySelectorAll("input[placeholder],textarea[placeholder]");
            if (formFields.length) formFields.forEach((formField => {
                if (!formField.hasAttribute("data-placeholder-nohide")) formField.dataset.placeholder = formField.placeholder;
            }));
            document.body.addEventListener("focusin", (function(e) {
                const targetElement = e.target;
                if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
                    if (targetElement.dataset.placeholder) ;
                    if (!targetElement.hasAttribute("data-no-focus-classes")) {
                        targetElement.classList.add("_form-focus");
                        targetElement.parentElement.classList.add("_form-focus");
                    }
                    formValidate.removeError(targetElement);
                }
            }));
            document.body.addEventListener("focusout", (function(e) {
                const targetElement = e.target;
                if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
                    if (targetElement.dataset.placeholder) targetElement.placeholder = targetElement.dataset.placeholder;
                    if (!targetElement.hasAttribute("data-no-focus-classes")) {
                        targetElement.classList.remove("_form-focus");
                        targetElement.parentElement.classList.remove("_form-focus");
                    }
                    if (targetElement.hasAttribute("data-validate")) formValidate.validateInput(targetElement);
                }
            }));
            if (options.viewPass) document.addEventListener("click", (function(e) {
                let targetElement = e.target;
                if (targetElement.closest('[class*="__viewpass"]')) {
                    let inputType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
                    targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
                    targetElement.classList.toggle("_viewpass-active");
                }
            }));
            if (options.autoHeight) {
                const textareas = document.querySelectorAll("textarea[data-autoheight]");
                if (textareas.length) {
                    textareas.forEach((textarea => {
                        const startHeight = textarea.hasAttribute("data-autoheight-min") ? Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
                        const maxHeight = textarea.hasAttribute("data-autoheight-max") ? Number(textarea.dataset.autoheightMax) : 1 / 0;
                        setHeight(textarea, Math.min(startHeight, maxHeight));
                        textarea.addEventListener("input", (() => {
                            if (textarea.scrollHeight > startHeight) {
                                textarea.style.height = `auto`;
                                setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
                            }
                        }));
                    }));
                    function setHeight(textarea, height) {
                        textarea.style.height = `${height}px`;
                    }
                }
            }
        }
        let formValidate = {
            getErrors(form) {
                let error = 0;
                let formRequiredItems = form.querySelectorAll("*[data-required]");
                if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                    if ((null !== formRequiredItem.offsetParent || "SELECT" === formRequiredItem.tagName) && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
                }));
                return error;
            },
            validateInput(formRequiredItem) {
                let error = 0;
                if ("email" === formRequiredItem.dataset.required) {
                    formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                    if (this.emailTest(formRequiredItem)) {
                        this.addError(formRequiredItem);
                        error++;
                    } else this.removeError(formRequiredItem);
                } else if ("checkbox" === formRequiredItem.type && !formRequiredItem.checked) {
                    this.addError(formRequiredItem);
                    error++;
                } else if ("tel" === formRequiredItem.type) {
                    if (18 !== formRequiredItem.value.length) {
                        this.addError(formRequiredItem);
                        error++;
                    }
                } else if (!formRequiredItem.value.trim()) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
                return error;
            },
            addError(formRequiredItem) {
                formRequiredItem.classList.add("_form-error");
                formRequiredItem.parentElement.classList.add("_form-error");
                let inputError = formRequiredItem.parentElement.querySelector(".form__error");
                if (inputError) formRequiredItem.parentElement.removeChild(inputError);
                if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
            },
            removeError(formRequiredItem) {
                formRequiredItem.classList.remove("_form-error");
                formRequiredItem.parentElement.classList.remove("_form-error");
                if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
            },
            formClean(form) {
                form.reset();
                setTimeout((() => {
                    let inputs = form.querySelectorAll("input,textarea");
                    for (let index = 0; index < inputs.length; index++) {
                        const el = inputs[index];
                        el.parentElement.classList.remove("_form-focus");
                        el.classList.remove("_form-focus");
                        formValidate.removeError(el);
                    }
                    let checkboxes = form.querySelectorAll(".checkbox__input");
                    if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                        const checkbox = checkboxes[index];
                        checkbox.checked = false;
                    }
                    if (flsModules.select) {
                        let selects = form.querySelectorAll(".select");
                        if (selects.length) for (let index = 0; index < selects.length; index++) {
                            const select = selects[index].querySelector("select");
                            flsModules.select.selectBuild(select);
                        }
                    }
                }), 0);
            },
            emailTest(formRequiredItem) {
                return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
            }
        };
        function formSubmit() {
            const forms = document.forms;
            if (forms.length) for (const form of forms) {
                form.addEventListener("submit", (function(e) {
                    const form = e.target;
                    formSubmitAction(form, e);
                }));
                form.addEventListener("reset", (function(e) {
                    const form = e.target;
                    formValidate.formClean(form);
                }));
            }
            async function formSubmitAction(form, e) {
                const error = !form.hasAttribute("data-no-validate") ? formValidate.getErrors(form) : 0;
                if (0 === error) {
                    const ajax = form.hasAttribute("data-ajax");
                    if (ajax) {
                        e.preventDefault();
                        const formAction = form.getAttribute("action") ? form.getAttribute("action").trim() : "#";
                        const formMethod = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";
                        const formData = new FormData(form);
                        form.classList.add("_sending");
                        const response = await fetch(formAction, {
                            method: formMethod,
                            body: formData
                        });
                        if (response.ok) {
                            let responseResult = await response.json();
                            form.classList.remove("_sending");
                            formSent(form, responseResult);
                        } else {
                            alert("Помилка");
                            form.classList.remove("_sending");
                        }
                    } else if (form.hasAttribute("data-dev")) {
                        e.preventDefault();
                        formSent(form);
                    }
                } else {
                    e.preventDefault();
                    if (form.querySelector("._form-error") && form.hasAttribute("data-goto-error")) {
                        const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : "._form-error";
                        gotoBlock(formGoToErrorClass, true, 1e3);
                    }
                }
            }
            function formSent(form, responseResult = ``) {
                document.dispatchEvent(new CustomEvent("formSent", {
                    detail: {
                        form
                    }
                }));
                setTimeout((() => {
                    if (flsModules.popup) {
                        const popup = form.dataset.popupMessage;
                        popup ? flsModules.popup.open(popup) : null;
                    }
                }), 0);
                formValidate.formClean(form);
                formLogging(`Форму відправлено!`);
            }
            function formLogging(message) {
                FLS(`[Форми]: ${message}`);
            }
        }
        window.addEventListener("DOMContentLoaded", (() => {
            const playBtns = document.querySelectorAll(".card__play-btn");
            if (playBtns.length) document.addEventListener("click", (e => {
                const target = e.target;
                playBtns.forEach((el => {
                    if (target.closest(".card__play-btn") === el) {
                        const video = el.previousElementSibling;
                        if (video.paused) {
                            video.play();
                            el.hidden = true;
                        }
                        video.addEventListener("ended", (() => {
                            el.hidden = false;
                        }));
                    }
                }));
                if (target === target.closest("video")) {
                    target.closest("video").pause();
                    target.closest("video").nextElementSibling.hidden = false;
                }
            }));
            let fbLink = document.querySelector("#facebook"), twLink = document.querySelector("#twitter"), copyLink = document.querySelector("#copy-link"), url = window.location.href;
            if (fbLink) fbLink.href = `https://www.addtoany.com/add_to/facebook?linkurl=${url}`;
            if (twLink) twLink.href = `https://www.addtoany.com/add_to/twitter?linkurl=${url}`;
            const copyLinkUrl = async () => {
                try {
                    if (window.isSecureContext && navigator.clipboard) {
                        await navigator.clipboard.writeText(url);
                        console.log("Content copied to clipboard");
                    }
                } catch (err) {
                    console.error("Failed to copy: ", err);
                }
            };
            if (copyLink) copyLink.addEventListener("click", copyLinkUrl);
            document.addEventListener("formSent", (function(e) {
                const currentForm = e.detail.form;
                if (currentForm) window.open("/thankyou.html", "_self");
            }));
            const backToHomeLink = document.querySelector(".footer__link");
            function addHomeUrl(targetLink) {
                if (targetLink) {
                    window.location.hostname;
                    targetLink.href = "/";
                }
            }
            addHomeUrl(backToHomeLink);
        }));
        var js = __webpack_require__(442);
        window.addEventListener("DOMContentLoaded", (() => {
            const sliderWrapper = document.querySelector("[data-swiper=text_swipe]");
            if (sliderWrapper) {
                const sliderBody = sliderWrapper.querySelector("ul"), slideHeight = sliderBody.clientHeight, interval = sliderWrapper.getAttribute("data-interval"), pause = sliderWrapper.getAttribute("data-pause");
                let currentSlide = 1, sliderElements = sliderBody.querySelectorAll("li");
                hideElements();
                totalSLidesHeight();
                function mySlideUp() {
                    sliderElements = sliderBody.querySelectorAll("li");
                    if (currentSlide === sliderElements.length) {
                        sliderBody.style.transition = "unset";
                        sliderBody.style.transform = `translateY(100%)`;
                        currentSlide = 0;
                        setTimeout(mySlideUp, 1);
                        return;
                    }
                    sliderBody.style.transition = "transform .3s ease";
                    sliderBody.style.transform = `translateY(-${slideHeight * currentSlide}px)`;
                    currentSlide++;
                    setTimeout(mySlideUp, +interval + +pause);
                    hideElements();
                    totalSLidesHeight();
                    return;
                }
                setTimeout(mySlideUp, interval);
                function hideElements() {
                    const contentBlock = document.querySelector(".header__content"), contentBlockWidth = contentBlock.clientWidth - parseInt(window.getComputedStyle(contentBlock).paddingLeft) - 5;
                    sliderElements.forEach((el => {
                        const slideElementWidth = parseInt(window.getComputedStyle(el).width);
                        if (slideElementWidth >= contentBlockWidth) el.remove();
                    }));
                    return;
                }
                function totalSLidesHeight() {
                    sliderBody.style.height = `${slideHeight * sliderElements.length}` + "px";
                }
            }
            const sliderMain = document.querySelector("#slider-main");
            if (sliderMain) {
                new js(sliderMain, {
                    cellSelector: ".slider-main__item",
                    wrapAround: true,
                    autoPlay: 7e3,
                    cellAlign: "center",
                    pageDots: false,
                    prevNextButtons: false
                });
            }
            let widthAll = () => window.innerWidth;
            window.addEventListener("resize", (() => widthAll()));
            let w = widthAll();
            const card = document.querySelector("#card");
            let position = "";
            if (w <= 834 && w > 425) position = "center"; else position = "left";
            if (card) {
                new js(card, {
                    cellSelector: ".card__wrapper",
                    wrapAround: true,
                    pageDots: false,
                    prevNextButtons: false,
                    cellAlign: position
                });
            }
        }));
        const scenario = document.querySelector(".buy-imposible");
        const heightSetings = scenario.getAttribute("data-pined");
        const scene = scenario.querySelector(".buy-imposible__wrapper");
        const wrapper = scene.querySelector(".slider-imposible__body");
        const sliders = wrapper.querySelectorAll(".slider-imposible__item");
        scenario.style.height = `${heightSetings}vh`;
        document.addEventListener("scroll", scrollEvent);
        window.addEventListener("resize", resizeEvent);
        function scrollEvent() {
            const scenarioParam = getParam(scenario);
            scenario.getBoundingClientRect().top, scrollY;
            scenario.getBoundingClientRect().bottom, window.innerHeight, scrollY;
            animation(scenarioParam, -33, 100);
        }
        calcSLiderMesures();
        function calcSLiderMesures() {
            let sliderWidth = scenario.querySelector(".slider-imposible").clientWidth;
            wrapper.style.width = sliderWidth * sliders.length + "px";
            sliders.forEach((slide => {
                slide.style.width = sliderWidth + "px";
            }));
        }
        function resizeEvent() {
            calcSLiderMesures();
        }
        function animation(scenarioParam, start, end) {
            const percentCurrent = -100 * scenarioParam.top / (scenarioParam.height - window.innerHeight);
            const value = (percentCurrent + start) / (end + start) * 100;
            if (percentCurrent >= start && percentCurrent <= end) wrapper.style.transform = `translate3d(${-value}%,0,0)`; else if (percentCurrent <= start) wrapper.style.transform = `translate3d(0%,0,0)`; else if (percentCurrent >= end) wrapper.style.transform = `translate3d($100%,0,0)`;
        }
        function getParam(element) {
            return {
                top: element.getBoundingClientRect().top,
                height: element.offsetHeight,
                bottom: element.getBoundingClientRect().bottom - window.innerHeight
            };
        }
        const progressBar = document.querySelector("[data-progress_bar]");
        if (progressBar) {
            const startFrom = parseInt(progressBar.getAttribute("data-start")), progressMax = parseInt(progressBar.getAttribute("data-max")), progressRandomPlus = parseInt(progressBar.getAttribute("data-max_plus")), progressInterval = parseInt(progressBar.getAttribute("data-timeout")), progressOutput = progressBar.querySelector(".progress__number"), progressVisual = progressBar.querySelector(".progress__line");
            progressOutput.textContent = startFrom;
            function setBarBg(current = 4e3, max = 1e4) {
                progressVisual.style.height = `${current / max * 100}%`;
            }
            function plusPoints(num) {
                let res = genRandomNum(num), currentNum = progressOutput.textContent;
                setBarBg(currentNum, progressMax);
                return progressOutput.textContent = +currentNum + res;
            }
            function genRandomNum(num = 2) {
                return Math.floor(Math.random() * (num + 1));
            }
            const intervalBar = setInterval((() => {
                let currentProgress = parseInt(progressOutput.textContent);
                plusPoints(progressRandomPlus);
                if (currentProgress >= progressMax) clearInterval(intervalBar);
            }), progressInterval);
        }
        window["FLS"] = false;
        isWebp();
        fullVHfix();
        formFieldsInit({
            viewPass: false,
            autoHeight: false
        });
        formSubmit();
        validatePhone();
    })();
})();