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
        hello: 'Hallo {name}',
      },
    },
    en: {
      message: {
        hello: 'Hello {name}',
      }
    },
    de_DE: {
      MSG_HELLO: 'Hallo ${name}',
    },
    en_EN: {
      MSG_HELLO: 'Hello ${name}',
    },
  },
  locale: 'de_DE',
  fallbackLocale: 'en_EN',
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
    {% trans('de', { name: 'John Doe' }) %}hello{% endtrans %}
    {% trans('de_DE', { name: 'John Doe' }) %}MSG_HELLO{% endtrans %}
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
    {{ 'hello'|trans('de', { name: 'John Doe' }) }}
    {{ 'MSG_HELLO'|trans('de_DE', { name: 'John Doe' }) }}
  </body>
</html>
```

[npm-image]: https://img.shields.io/npm/v/nunjucks-translation.svg?label=NPM%20Version
[npm-url]: https://npmjs.org/package/nunjucks-translation
[downloads-image]: https://img.shields.io/npm/dt/nunjucks-translation?label=Downloads
[downloads-url]: https://npmjs.org/package/nunjucks-translation
[github-actions-image]: https://img.shields.io/github/workflow/status/mgascoyne/nunjucks-translation/Tests/master?label=Build
[github-actions-url]: https://github.com/mgascoyne/nunjucks-translation/actions
