import { Extension, runtime } from 'nunjucks';
import { Context } from 'vm';
import SafeString = runtime.SafeString;

/**
 * Nunjucks extension for content translation.
 */
export class TranslationExtension implements Extension {
  /**
   * Constructor.
   *
   * @param {object} options - Options for the extension.
   */
  constructor(
    private readonly options: TranslationExtensionOptions = {
      translations: {},
      locale: 'en',
      fallbackLocale: 'en',
    },
  ) {}

  /**
   * Tags this extension supports.
   */
  get tags(): string[] {
    return ['trans'];
  }

  /**
   * Parse tag.
   *
   * @param {any} parser - Nunjucks parser
   * @param {any} nodes - Nunjucks nodes
   * @param {any} lexer - Nunjucks lexer
   */
  public parse(parser, nodes, lexer) {
    // get the tag token
    const tok = parser.nextToken();

    // parse the args and move after the block end. passing true
    // as the second arg is required if there are no parentheses
    const args = parser.parseSignature(null, false);
    parser.advanceAfterBlockEnd(tok.value);

    // parse the body
    const body = parser.parseUntilBlocks('endtrans');

    parser.advanceAfterBlockEnd();

    return new nodes.CallExtension(this, 'trans', args, [body]);
  }

  /**
   * Translate text.
   *
   * @param {Context} context - Nunjucks context.
   * @param {string} locale - Locale.
   * @param {Function} body - Function providing body.
   * @return {string}
   */
  public trans(...args: any): // context: Context,
  // locale: string,
  // body: () => string,
  SafeString {
    const context = args.shift();
    const locale = args.shift();
    const body = args.pop();
    const params = args.shift() || {};

    const translationId: string = typeof body === 'function' ? body() : '';
    const translatedText: string = this.translateText(
      translationId,
      locale,
      params,
    );

    return new SafeString(translatedText);
  }

  /**
   * Translate text.
   *
   * @param {string} textId - Text ID to translate.
   * @param {string} locale - Translation locale.
   * @param {object} params - Params for translation
   * @return {string}
   * @private
   */
  public translateText(textId: string, locale: string, params: object): string {
    locale = this.selectLocale(locale, textId);

    let translated: string =
      this.options.translations[locale]?.['message']?.[textId] || textId;

    // Parameter substitution
    for (const paramName in params) {
      const paramValue: string =
        typeof params[paramName] === 'string' ? params[paramName] : '';
      translated = this.replaceAll(
        translated,
        '{' + paramName + '}',
        paramValue,
      );
    }

    return translated;
  }

  /**
   * String escaping for RegEx.
   *
   * @param {string} str - The string to escape
   * @return {string}
   * @private
   */
  private escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  /**
   * Replace all occurrences of a string.
   *
   * @param {string} str - The subject
   * @param {string} find - String to replace
   * @param {string} replace - The replacement
   * @return {string}
   * @private
   */
  private replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }

  /**
   * Check if translation exists for given locale and text id.
   *
   * @param {string} locale - Locale
   * @param {string} textId  - Text ID
   * @return {boolean}
   * @private
   */
  private translationExistsForLocale(locale: string, textId: string): boolean {
    return (
      this.options.translations[locale]?.['message']?.[textId] !== undefined
    );
  }

  /**
   * Select locale for translation.
   *
   * @param {string} locale - Given locale
   * @param {string} textId - Text ID
   * @return {string}
   * @private
   */
  private selectLocale(locale: string, textId: string): string {
    // use given locale
    if (locale && this.translationExistsForLocale(locale, textId)) {
      return locale;
    }

    // use default locale if locale is not given
    if (
      !locale &&
      this.translationExistsForLocale(this.options.locale, textId)
    ) {
      return this.options.locale;
    }

    // use fallback locale
    return this.options.fallbackLocale;
  }
}

/**
 * Options for TranslationExtension.
 */
export interface TranslationExtensionOptions {
  translations: object;
  locale: string;
  fallbackLocale: string;
}
