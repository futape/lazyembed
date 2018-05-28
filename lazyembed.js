(function() {
    var LazyEmbed = function(options) {
        this.setOptions(options);
        this.init();
    };

    LazyEmbed.prototype = {
        defaults: {
            elements: '.lazyembed',
            overlayText: 'Click to load',
            overlayBackground: 'rgba(0, 0, 0, .6)',
            overlayColor: '#fff',
            adoptResponsiveEmbed: true,
            excludeElements: 'a',
            onClick: function() {},
            onLoad: function() {},
            onInit: function() {}
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
                var embed = embeds[i];
                var clonedEmbed = embed.cloneNode();
                var parent = embed.parentElement;

                var wrapper = document.createElement('div');
                wrapper.style.zIndex = '0';
                wrapper.style.display = 'inline-block';
                wrapper.style.lineHeight = '0';
                if (options.adoptResponsiveEmbed && (parent.className.match(/(?:\s|^)embed-responsive(?:\s|$)/) !== null || clonedEmbed.className.match(/(?:\s|^)embed-responsive-item(?:\s|$)/) !== null)) {
                    wrapper.className = 'embed-responsive-item';
                } else {
                    wrapper.style.position = 'relative';
                }

                var image;
                if (clonedEmbed.hasAttribute('data-placeholder')) {
                    image = document.createElement('div');
                    image.style.position = 'absolute';
                    image.style.zIndex = '1';
                    image.style.left = '0';
                    image.style.top = '0';
                    image.style.width = '100%';
                    image.style.height = '100%';
                    image.style.backgroundImage = 'url(' + clonedEmbed.getAttribute('data-placeholder') + ')';
                    image.style.backgroundSize = 'cover';
                    image.style.backgroundPosition = 'center center';
                }

                var overlay = document.createElement('div');
                overlay.style.position = 'absolute';
                overlay.style.zIndex = '2';
                overlay.style.left = '0';
                overlay.style.top = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.cursor = 'pointer';
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
                overlayText.style.position = 'absolute';
                overlayText.style.left = '1rem';
                overlayText.style.right = '1rem';
                overlayText.style.top = '50%';
                overlayText.style.transform = 'translateY(-50%)';
                overlayText.style.paddingTop = '1rem';
                overlayText.style.paddingBottom = '1rem';
                overlayText.style.textAlign = 'center';
                overlayText.style.lineHeight = '1';
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
            }
        }
    };

    window.LazyEmbed = LazyEmbed;
})();
