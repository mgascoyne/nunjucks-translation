# Nunjucks Translation

[![Build][github-actions-image]][github-actions-url]
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

Nunjucks extension for translation. With this
you can use the `trans` and `endtrans` tags or the `trans` filter. 

### How to install it?

```
$ npm install nunjucks-translation
```

### How to use it?

Example using static translations

```js
import { TranslationExtension } from 'nunjucks-translation';

const translationExtension = new TranslationExtension({
  translations: {
    de: {
      message: {
        hello1: 'Hallo',
        hello2: 'Hallo {name}',
      },
    },
    en: {
      message: {
        hello1: 'Hello',
        hello2: 'Hello {name}',
      }
    },
  },
  locale: 'de',
  fallbackLocale: 'en',
});

nunjucksEnv.addExtension('translation-extension', translationExtension);
nunjucksEnv.addFilter('trans', (textId: string, locale: string, params: object) =>
  translationExtension.translateText(textId, locale, params),
);
```
Example using translations from JSON file:

```js
import * as fs from 'fs';
import { TranslationExtension } from 'nunjucks-translation';

const translationExtension = new TranslationExtension(
  JSON.parse(
    fs.readFileSync('/path/to/translation.json', 'utf8'),
  )  
);

nunjucksEnv.addExtension('translation-extension', translationExtension);
nunjucksEnv.addFilter('trans', (textId: string, locale: string, params: object) =>
  translationExtension.translateText(textId, locale, params),
);
```

#### Translate content using tags

You can use the `trans` and `endtrans` tags to translate your content.

```html
<html>
  <head>
  </head>
  <body>
    {% trans('de') %}message.hello1{% endtrans %} // result will be "Hallo"
    {% trans('en') %}message.hello1{% endtrans %} // result will be "Hello"
    {% trans('de', { name: 'John Doe' }) %}message.hello2{% endtrans %} // result will be "Hallo John Doe"
    {% trans('de', { name: 'John Doe' }) %}message.hello2{% endtrans %} // result will be "Hello John Doe"

    {% trans(null) %}message.hello1{% endtrans %} // result will be "Hallo" due to default locale
    {% trans('es') %}message.hello1{% endtrans %} // result will be "Hello" due to fallback locale
  </body>
</html>
```

#### Translate content using filter

You can also use the `trans` filter to translate your content.

```html
<html>
  <head>
  </head>
  <body>
    {{ 'message.hello1'|trans('de') }} // result will be "Hallo"
    {{ 'message.hello1'|trans('en') }} // result will be "Hello"
    {{ 'message.hello2'|trans('de', { name: 'John Doe' }) }} // result will be "Hallo John Doe"
    {{ 'message.hello2'|trans('en', { name: 'John Doe' }) }} // result will be "Hello John Doe"

    {{ 'message.hello1'|trans(null) }} // result will be "Hallo" due to default locale
    {{ 'message.hello1'|trans('es) }} // result will be "Hello" due to fallback locale
  </body>
</html>
```

[npm-image]: https://img.shields.io/npm/v/nunjucks-translation.svg?label=NPM%20Version
[npm-url]: https://npmjs.org/package/nunjucks-translation
[downloads-image]: https://img.shields.io/npm/dt/nunjucks-translation?label=Downloads
[downloads-url]: https://npmjs.org/package/nunjucks-translation
[github-actions-image]: https://img.shields.io/github/workflow/status/mgascoyne/nunjucks-translation/Tests/master?label=Build
[github-actions-url]: https://github.com/mgascoyne/nunjucks-translation/actions
