const LazyEmbed = (() => {
    const DEFAULTS = {
        elements: '[data-lazyembed]',
        overlayText: 'Click to load',
        // !!! DEPRECATED !!! overlayBackground: 'rgba(0, 0, 0, .6)',
        // !!! DEPRECATED !!! overlayColor: '#fff',
        adoptResponsiveEmbed: true,
        excludeElements: 'a',
        classes: {
            root: 'lazyembed',
            overlay: 'lazyembed__overlay',
            text: 'lazyembed__text',
            placeholder: 'lazyembed__placeholder',
            embed: 'lazyembed__embed',
        },
        onClick: () => {
        },
        onLoad: () => {
        },
        onInit: () => {
        },
    };
    const EMBED_RESPONSIVE_PATTERN = /(?:\s|^)embed-responsive(?:\s|$)/;
    const EMBED_RESPONSIVE_ITEM_PATTERN = /(?:\s|^)embed-responsive-item(?:\s|$)/;

    const extend = (target, source) => {
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                if (Object.prototype.toString.call(source[key]) === '[object Object]') {
                    if (Object.prototype.toString.call(target[key]) !== '[object Object]') {
                        target[key] = {};
                    }

                    extend(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    class LazyEmbed
    {
        static get defaults()
        {
            return DEFAULTS;
        }

        constructor(options = {})
        {
            this.setOptions(options);
            this.init();
        }

        setOptions(options)
        {
            this.options = {};
            extend(this.options, LazyEmbed.defaults);
            extend(this.options, options);
        }

        init()
        {
            let embeds;
            if (typeof this.options.elements === 'string') {
                embeds = document.querySelectorAll(this.options.elements);
            } else {
                embeds = this.options.elements;
            }

            for (let i = 0; i < embeds.length; i++) {
                const embed = embeds[i];
                const parent = embed.parentElement;

                const clonedEmbed = embed.cloneNode(true);
                clonedEmbed.className += ' ' + this.options.classes.embed;

                const wrapper = document.createElement('div');
                wrapper.className = this.options.classes.root;
                if (this.options.adoptResponsiveEmbed && (parent.className.match(
                    EMBED_RESPONSIVE_PATTERN) !== null || clonedEmbed.className.match(
                    EMBED_RESPONSIVE_ITEM_PATTERN) !== null)) {
                    wrapper.className += ' embed-responsive-item';
                }

                let image;
                if (clonedEmbed.hasAttribute('data-placeholder')) {
                    image = document.createElement('div');
                    image.className = this.options.classes.placeholder;
                    image.style.backgroundImage = 'url(' + clonedEmbed.getAttribute('data-placeholder') + ')';
                }

                const overlay = document.createElement('div');
                overlay.className = this.options.classes.overlay;
                if (typeof this.options.overlayBackground !== 'undefined') {
                    overlay.style.background = this.options.overlayBackground;
                }
                overlay.addEventListener('click', () => {
                    overlay.style.display = 'none';
                    if (image) {
                        image.style.display = 'none';
                    }

                    if (clonedEmbed.hasAttribute('data-src')) {
                        clonedEmbed.addEventListener('load', () => {
                            this.options.onLoad(clonedEmbed);
                        }, {
                            once: true
                        }, false);
                        clonedEmbed.setAttribute('src', clonedEmbed.getAttribute('data-src'));
                    }

                    this.options.onClick(clonedEmbed);
                }, false);

                const overlayText = document.createElement('div');
                overlayText.className = this.options.classes.text;
                if (typeof this.options.overlayColor !== 'undefined') {
                    overlayText.style.color = this.options.overlayColor;
                }
                overlayText.innerHTML = this.options.overlayText;

                overlay.appendChild(overlayText);

                const overlayExcludes = overlay.querySelectorAll(this.options.excludeElements);
                for (let u = 0; u < overlayExcludes.length; u++) {
                    overlayExcludes[u].addEventListener('click', e => {
                        e.stopPropagation();
                    }, false);
                }

                wrapper.appendChild(clonedEmbed);
                if (image) {
                    wrapper.appendChild(image);
                }
                wrapper.appendChild(overlay);

                embed.parentNode.replaceChild(wrapper, embed);

                this.options.onInit(wrapper);
            }
        }
    }

    return LazyEmbed;
})();

export default LazyEmbed;
