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
      defaultLocale: 'EN',
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
  public trans(
    context: Context,
    locale: string,
    body: () => string,
  ): SafeString {
    const translationId: string = body();
    const translatedText: string = this.translateText(translationId, locale);

    return new SafeString(translatedText);
  }

  /**
   * Translate text.
   *
   * @param {string} textId - Text ID to translate.
   * @param {string} locale - Translation locale.
   * @return {string}
   * @private
   */
  public translateText(textId: string, locale: string): string {
    locale = locale || this.options.defaultLocale;

    if (!this.options.translations[locale]) {
      locale = this.options.defaultLocale;
    }

    return this.options.translations[locale][textId] || textId;
  }
}

/**
 * Options for TranslationExtension.
 */
export interface TranslationExtensionOptions {
  translations: object;
  defaultLocale: string;
}
