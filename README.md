# LazyEmbed

LazyEmbed is a JavaScript library for loading embeds and individual content on click.

[![NPM](https://nodei.co/npm/lazyembed2.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/lazyembed2/)



## Install

Install LazyEmbed via npm

```
npm install lazyembed2
```

Include in your site

```html
<!DOCTYPE html>
<html>
    <head>
        <!-- ... -->
        <link rel="stylesheet" href="dist/lazyembed.min.css" />
    </head>
    <body>
        <!-- ... -->
        <script src="dist/lazyembed.min.js"></script>
    </body>
</html>
```

Adjust your markup

<pre><code>
&lt;iframe
    width="560"
    height="315"
    <b>data-src="https://www.youtube.com/embed/LVPNXsc4wsQ?rel=0"</b>
    frameborder="0"
    allow="autoplay; encrypted-media"
    allowfullscreen
    <b>data-placeholder="https://i.ytimg.com/vi/LVPNXsc4wsQ/hqdefault.jpg"</b>
    <b>data-lazyembed</b>
&gt;&lt;/iframe&gt;
</code></pre>

Call LazyEmbed

```javascript
new LazyEmbed();
```

See `example.html` for an example.



## API

### HTML

Argument | Required | Description
-------- | -------- | -----------
`data-src` | No | The source of the embedded content. Usually you will use this instead of an `iframe`'s `src` attribute.
`data-placeholder` | No | An URI of an image used as placeholder for the embedded content. For example a video thumbnail.

### JavaScript

You can pass an object of options to LazyEmbed's constructor.

Option | Type | Required | Default | Description
------ | ---- | -------- | ------- | -----------
`elements` | <code>string &vert; Iteratable&lt;HTMLElement&gt;</code> | Yes | `'[data-lazyembed]'` | The embed elements to lazyload. Either a string used as selector or an iteratable of `HTMLElement`s implementing the `forEach` method.
`overlayText` | `string` | Yes | `'Click to load'` | The text printed on the overlay. Can contain HTML.
`overlayBackground` | `string` | No | - | **_DEPRECATED_** The background color of the overlay. Can be any CSS color.
`overlayColor` | `string` | No | - | **_DEPRECATED_** The overlay's text color. Can be any CSS color.
`adoptResponsiveEmbed` | `bool` | Yes | `true` | If set to `true`, LazyEmbed tries to adept [Bootstrap's `embed-responsive` class](https://getbootstrap.com/docs/4.1/utilities/embed/) from the embed element.
`excludeElements` | `string` | Yes | `'a'` | A selector defining child elements of the overlay which should not trigger loading the embed content. For example one would not want to trigger the loading when clicking on a link to the privacy policy.
`classes.root` | `string` | Yes | `'lazyembed'` | The class to apply to the outermost LazyEmbed element wrapped around the embed element. When not applying the default class, you have to adjust the CSS.
`classes.overlay` | `string` | Yes | `'lazyembed__overlay'` | The class to apply to the overlay element. When not applying the default class, you have to adjust the CSS.
`classes.text` | `string` | Yes | `'lazyembed__text'` | The class to apply to the overlay text element. When not applying the default class, you have to adjust the CSS.
`classes.placeholder` | `string` | Yes | `'lazyembed__placeholder'` | The class to apply to the placeholder image. When not applying the default class, you have to adjust the CSS.
`classes.embed` | `string` | Yes | `'lazyembed__embed'` | The class to apply to the embed element. This class is just for identifying purpose, it doesn't define any styling by default.
`onClick` | `function` | Yes | _Empty function_ | A callback function of the following form `function(HTMLElement embed)`, called when the user clicks on the overlay and after the LazyEmbed parts are hidden and the embedded content is requested.
`onLoad` | `function` | Yes | _Empty function_ | A callback function of the following form `function(HTMLElement embed)`, bound to the `iframe`'s `load` event.
`onInit` | `function` | Yes | _Empty function_ | A callback function of the following form `function(HTMLElement wrapper)`, called when LazyEmbed has fully initialised the embed element.



## Loading individual (non-iframe) content

Omit the `data-src` attribute and use the `onClick` option to load the content manually.



## Image Proxy

Use the `proxy.php` file for hiding the user's IP address from the image provider.

Just use the proxy's URI as the `data-placeholder` attribute's value and pass the image's URI to the proxy's `uri` parameter (remember to escape the URI).
For security reasons you have to whitelist the providers' host names. By default only `googleapis.com` and `ytimg.com` are whitelisted, but this list can be easily adjusted. Just have a look on the `proxy.php` file.


