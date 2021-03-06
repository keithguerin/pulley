Pulley
=====

Lightweight javascript framework.

These tools are all managed through [CodeKit](https://incident57.com/codekit/) and the file [config.codekit](https://github.com/keithguerin/pulley/blob/master/config.codekit).

All source code is found inside of 'html/source'. This code is processed into three primary files in 'html': index.html, scripts.min.js, and styles.min.js.

### HTML Documents (index.html)
All HTML in this project is generated by Jade. [Jade](http://jade-lang.com/) is an HTML templating engine, built on Node. It allows for a simple syntax, variables, and imports.

<!--
### Styles (styles.min.js)
All styles are written in [Stylus](http://learnboost.github.io/stylus/). Stylus is a CSS pre-processor with a minimal syntax.
* [Nib](http://visionmedia.github.io/nib/) is a Stylus mix-in library.
* styles.min.css.map allows debugging and editing of styles in Chrome Developer Tools (pending completion by the Stylus dev team).
-->

### Styles (alt) (styles.min.js)
All styles are written in [Sass](http://learnboost.github.io/stylus/).
* [Bourbon](http://bourbon.io/) is a Sass mix-in library.
* styles.min.css.map allows debugging and editing of styles in Chrome Developer Tools. [Instructions](https://developers.google.com/chrome-developer-tools/docs/css-preprocessors).

### Scripts (scripts.min.js)
Scripts use the MVC pattern defined by [Pulley](https://github.com/keithguerin/pulley). Pulley provides a common way to organize code, and favors native JavaScript over custom syntax.
* jQuery is used for selectors, event binding, and sparsely for other utilities.
* scripts.min.css.map allows debugging and editing of styles in Chrome Developer Tools. [Instructions](https://developers.google.com/chrome-developer-tools/docs/javascript-debugging).