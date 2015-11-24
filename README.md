# fabiang/mink-javascript-errors

This is an extension for Mink that can handle JavaScript errors occuring on a web page.
After every step this extension checks for error and throws them as exceptions.
Also AJAX errors are supported via jQuery.

[![Build Status](https://travis-ci.org/fabiang/mink-javascript-errors.svg?branch=master)](https://travis-ci.org/fabiang/mink-javascript-errors)
[![License](https://poser.pugx.org/fabiang/mink-javascript-errors/license)](https://packagist.org/packages/fabiang/mink-javascript-errors)

## Installation

Install this extension with [Composer](http://getcomposer.org/):

```
composer require fabiang/mink-javascript-errors=@dev --dev
```

## Configuration

Add the following to your `behat.yml`:

```yaml
default:
  extensions:
    Fabiang\Mink\JavaScriptErrors: ~
```

Load the provided JavaScript file in every of your web pages:

```html
<script src="dist/ErrorHandler.min.js"></script>
```

If you have loaded jQuery before the `ErrorHandler.min.js` the extension automatically handles Ajax errors.
