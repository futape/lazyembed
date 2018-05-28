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
            excludeElements: 'a'
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
            var iframes;
            if (typeof this.options.elements === 'string') {
                iframes = document.querySelectorAll(this.options.elements);
            } else {
                iframes = this.options.elements;
            }

            for (var i = 0; i < iframes.length; i++) {
                var iframe = iframes[i];
                var clonedIframe = iframe.cloneNode();
                var parent = iframe.parentElement;

                var wrapper = document.createElement('div');
                wrapper.style.zIndex = '0';
                wrapper.style.display = 'inline-block';
                wrapper.style.lineHeight = '0';
                if (this.options.adoptResponsiveEmbed && (parent.className.match(/(?:\s|^)embed-responsive(?:\s|$)/) !== null || clonedIframe.className.match(/(?:\s|^)embed-responsive-item(?:\s|$)/) !== null)) {
                    wrapper.className = 'embed-responsive-item';
                } else {
                    wrapper.style.position = 'relative';
                }

                var image;
                if (clonedIframe.hasAttribute('data-placeholder')) {
                    image = document.createElement('div');
                    image.style.position = 'absolute';
                    image.style.zIndex = '1';
                    image.style.left = '0';
                    image.style.top = '0';
                    image.style.width = '100%';
                    image.style.height = '100%';
                    image.style.backgroundImage = 'url(' + clonedIframe.getAttribute('data-placeholder') + ')';
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
                overlay.style.backgroundColor = this.options.overlayBackground;
                overlay.addEventListener('click', function() {
                    overlay.style.display = 'none';
                    if (image) {
                        image.style.display = 'none';
                    }
                    clonedIframe.setAttribute('src', clonedIframe.getAttribute('data-src'));
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
                overlayText.style.color = this.options.overlayColor;
                overlayText.innerHTML = this.options.overlayText;

                overlay.appendChild(overlayText);

                var overlayExcludes = overlay.querySelectorAll(this.options.excludeElements);
                for (var u = 0; u < overlayExcludes.length; u++) {
                    overlayExcludes[u].addEventListener('click', function(e) {
                        e.stopPropagation();
                    }, false);
                }

                wrapper.appendChild(clonedIframe);
                if (image) {
                    wrapper.appendChild(image);
                }
                wrapper.appendChild(overlay);

                iframe.parentNode.replaceChild(wrapper, iframe);

            }
        }
    };

    window.LazyEmbed = LazyEmbed;
})();
