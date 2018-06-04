var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LazyEmbed = function () {
    var DEFAULTS = {
        elements: '[data-lazyembed]',
        overlayText: 'Click to load',
        overlayBackground: 'rgba(0, 0, 0, .6)',
        overlayColor: '#fff',
        adoptResponsiveEmbed: true,
        excludeElements: 'a',
        classes: {
            root: 'lazyembed',
            overlay: 'lazyembed__overlay',
            text: 'lazyembed__text',
            placeholder: 'lazyembed__placeholder',
            embed: 'lazyembed__embed'
        },
        onClick: function onClick() {},
        onLoad: function onLoad() {},
        onInit: function onInit() {}
    };
    var EMBED_RESPONSIVE_PATTERN = /(?:\s|^)embed-responsive(?:\s|$)/;
    var EMBED_RESPONSIVE_ITEM_PATTERN = /(?:\s|^)embed-responsive-item(?:\s|$)/;

    var LazyEmbed = function () {
        _createClass(LazyEmbed, null, [{
            key: 'defaults',
            get: function get() {
                return DEFAULTS;
            }
        }]);

        function LazyEmbed() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, LazyEmbed);

            this.setOptions(options);
            this.init();
        }

        _createClass(LazyEmbed, [{
            key: 'setOptions',
            value: function setOptions(options) {
                this.options = options;
                for (var key in LazyEmbed.defaults) {
                    if (LazyEmbed.defaults.hasOwnProperty(key) && typeof this.options[key] === 'undefined') {
                        this.options[key] = LazyEmbed.defaults[key];
                    }
                }

                console.log(options, this.options, LazyEmbed.defaults);
            }
        }, {
            key: 'init',
            value: function init() {
                var _this = this;

                var embeds = void 0;
                if (typeof this.options.elements === 'string') {
                    embeds = document.querySelectorAll(this.options.elements);
                } else {
                    embeds = this.options.elements;
                }

                console.log(embeds, this.options.elements);

                embeds.forEach(function (embed) {
                    var parent = embed.parentElement;

                    var clonedEmbed = embed.cloneNode(true);
                    clonedEmbed.className += _this.options.classes.embed;

                    var wrapper = document.createElement('div');
                    wrapper.className = _this.options.classes.root;
                    if (_this.options.adoptResponsiveEmbed && (parent.className.match(EMBED_RESPONSIVE_PATTERN) !== null || clonedEmbed.className.match(EMBED_RESPONSIVE_ITEM_PATTERN) !== null)) {
                        wrapper.className += ' embed-responsive-item';
                    }

                    var image = void 0;
                    if (clonedEmbed.hasAttribute('data-placeholder')) {
                        image = document.createElement('div');
                        image.className = _this.options.classes.placeholder;
                        image.style.backgroundImage = 'url(' + clonedEmbed.getAttribute('data-placeholder') + ')';
                    }

                    var overlay = document.createElement('div');
                    overlay.className = _this.options.classes.overlay;
                    overlay.style.backgroundColor = _this.options.overlayBackground;
                    overlay.addEventListener('click', function () {
                        overlay.style.display = 'none';
                        if (image) {
                            image.style.display = 'none';
                        }

                        if (clonedEmbed.hasAttribute('data-src')) {
                            clonedEmbed.addEventListener('load', function () {
                                _this.options.onLoad(clonedEmbed);
                            }, false);
                            clonedEmbed.setAttribute('src', clonedEmbed.getAttribute('data-src'));
                        }

                        _this.options.onClick(clonedEmbed);
                    }, false);

                    var overlayText = document.createElement('div');
                    overlayText.className = _this.options.classes.text;
                    overlayText.style.color = _this.options.overlayColor;
                    overlayText.innerHTML = _this.options.overlayText;

                    overlay.appendChild(overlayText);

                    var overlayExcludes = overlay.querySelectorAll(_this.options.excludeElements);
                    overlayExcludes.forEach(function (overlayExclude) {
                        overlayExclude.addEventListener('click', function (e) {
                            e.stopPropagation();
                        }, false);
                    });

                    wrapper.appendChild(clonedEmbed);
                    if (image) {
                        wrapper.appendChild(image);
                    }
                    wrapper.appendChild(overlay);

                    embed.parentNode.replaceChild(wrapper, embed);

                    _this.options.onInit(wrapper);
                });
            }
        }]);

        return LazyEmbed;
    }();

    return LazyEmbed;
}();
//# sourceMappingURL=lazyembed.js.map
