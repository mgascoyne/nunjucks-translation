import { TranslationExtension } from './translation.extension';

/**
 * Tests for Nunjucks Translation Extension.
 */
describe('TranslationExtension', () => {
  let extension: TranslationExtension = null;
  let extensionMissingFallbackLocale: TranslationExtension = null;

  beforeEach(() => {
    extension = new TranslationExtension({
      translations: {
        de: {
          message: {
            hello: 'Hallo',
            hello_with_params: 'Hallo {name}',
          },
        },
        en: {
          message: {
            hello: 'Hello',
            hello_with_params: 'Hello {name}',
          },
        },
      },
      locale: 'en',
      fallbackLocale: 'en',
    });

    extensionMissingFallbackLocale = new TranslationExtension({
      translations: {
        de: {
          message: {
            hello: 'Hallo',
          },
        },
        en: {
          message: {
            hello: 'Hello',
          },
        },
      },
      locale: 'en',
      fallbackLocale: 'fr',
    });
  });

  it('supports suggested tags', () => {
    expect(extension.tags).toContain('trans');
  });

  it('parses correctly', () => {
    const nextTokenMock = jest.fn(() => {
      return { value: 'token_value' };
    });
    const parseSignatureMock = jest.fn(() => ['arg1', 'arg2']);
    const advanceAfterBlockEndMock = jest.fn();
    const parseUntilBlocksMock = jest.fn(() => 'hello');
    const parserMock = class {
      nextToken = nextTokenMock;
      parseSignature = parseSignatureMock;
      advanceAfterBlockEnd = advanceAfterBlockEndMock;
      parseUntilBlocks = parseUntilBlocksMock;
    };

    const callExtensionMock = class {};

    const nodesMock = class {
      CallExtension = callExtensionMock;
    };

    const lexerMock = jest.fn();

    expect(
      extension.parse(new parserMock(), new nodesMock(), lexerMock),
    ).toBeInstanceOf(callExtensionMock);

    expect(nextTokenMock).toHaveBeenCalled();
    expect(parseSignatureMock).toHaveBeenCalledWith(null, false);
    expect(parseUntilBlocksMock).toHaveBeenCalledWith('endtrans');
    expect(advanceAfterBlockEndMock).toHaveBeenCalledWith('token_value');
  });

  it('translates correctly for de locale', () => {
    expect(extension.trans({}, 'de', () => 'hello')).toEqual({
      length: 5,
      val: 'Hallo',
    });
  });

  it('translates correctly for en locale', () => {
    expect(extension.trans({}, 'en', () => 'hello')).toEqual({
      length: 5,
      val: 'Hello',
    });
  });

  it('translates correctly with fallback to default en locale', () => {
    expect(extension.trans({}, undefined, () => 'hello')).toEqual({
      length: 5,
      val: 'Hello',
    });
  });

  it('translates correctly with fallback to default en locale', () => {
    expect(extension.trans({}, 'fr', () => 'hello')).toEqual({
      length: 5,
      val: 'Hello',
    });
  });

  it('translates correctly with parameters for de locale', () => {
    expect(
      extension.trans({}, 'de', { name: 'Welt' }, () => 'hello_with_params'),
    ).toEqual({
      length: 10,
      val: 'Hallo Welt',
    });
  });

  it('translates correctly with parameters for en locale', () => {
    expect(
      extension.trans({}, 'en', { name: 'World' }, () => 'hello_with_params'),
    ).toEqual({
      length: 11,
      val: 'Hello World',
    });
  });

  it('returns translation key on missing translation entry', () => {
    expect(extension.trans({}, 'de', () => 'unknown')).toEqual({
      length: 7,
      val: 'unknown',
    });
  });

  it('returns translation key if locale and default locale not found', () => {
    expect(
      extensionMissingFallbackLocale.trans({}, 'es', () => 'unknown'),
    ).toEqual({
      length: 7,
      val: 'unknown',
    });
  });
});
