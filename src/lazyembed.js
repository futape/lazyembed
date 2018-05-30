const LazyEmbed = function(options) {
    this.setOptions(options);
    this.init();
};

LazyEmbed.prototype = {
    defaults: {
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
        onClick: function() {
        },
        onLoad: function() {
        },
        onInit: function() {
        },
    },

    setOptions: function(options) {
        this.options = options || {};
        for (var key in this.defaults) {
            if (!this.options[key]) {
                this.options[key] = this.defaults[key];
            }
        }
    },

    init: function() {
        var options = this.options;

        var embeds;
        if (typeof options.elements === 'string') {
            embeds = document.querySelectorAll(options.elements);
        } else {
            embeds = options.elements;
        }

        for (var i = 0; i < embeds.length; i++) {
            (function() {
                var embed = embeds[i];
                var parent = embed.parentElement;
                var embedResponsivePattern = /(?:\s|^)embed-responsive(?:\s|$)/;
                var embedResponsiveItemPattern = /(?:\s|^)embed-responsive-item(?:\s|$)/;

                var clonedEmbed = embed.cloneNode(true);
                clonedEmbed.className += options.classes.embed;

                var wrapper = document.createElement('div');
                wrapper.className = options.classes.root;
                if (options.adoptResponsiveEmbed && (parent.className.match(
                    embedResponsivePattern) !== null || clonedEmbed.className.match(
                    embedResponsiveItemPattern) !== null)) {
                    wrapper.className += ' embed-responsive-item';
                }

                var image;
                if (clonedEmbed.hasAttribute('data-placeholder')) {
                    image = document.createElement('div');
                    image.className = options.classes.placeholder;
                    image.style.backgroundImage = 'url(' + clonedEmbed.getAttribute('data-placeholder') + ')';
                }

                var overlay = document.createElement('div');
                overlay.className = options.classes.overlay;
                overlay.style.backgroundColor = options.overlayBackground;
                overlay.addEventListener('click', function() {
                    overlay.style.display = 'none';
                    if (image) {
                        image.style.display = 'none';
                    }

                    if (clonedEmbed.hasAttribute('data-src')) {
                        clonedEmbed.addEventListener('load', function() {
                            options.onLoad(clonedEmbed);
                        }, false);
                        clonedEmbed.setAttribute('src', clonedEmbed.getAttribute('data-src'));
                    }

                    options.onClick(clonedEmbed);
                }, false);

                var overlayText = document.createElement('div');
                overlayText.className = options.classes.text;
                overlayText.style.color = options.overlayColor;
                overlayText.innerHTML = options.overlayText;

                overlay.appendChild(overlayText);

                var overlayExcludes = overlay.querySelectorAll(options.excludeElements);
                for (var u = 0; u < overlayExcludes.length; u++) {
                    overlayExcludes[u].addEventListener('click', function(e) {
                        e.stopPropagation();
                    }, false);
                }

                wrapper.appendChild(clonedEmbed);
                if (image) {
                    wrapper.appendChild(image);
                }
                wrapper.appendChild(overlay);

                embed.parentNode.replaceChild(wrapper, embed);

                options.onInit(wrapper);
            })();
        }
    },
};

export default LazyEmbed;

