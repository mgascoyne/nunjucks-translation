import { TranslationExtension } from './translation.extension';

/**
 * Tests for Nunjucks Translation Extension.
 */
describe('TranslationExtension', () => {
  let extension: TranslationExtension = null;
  let extensionMissingDefaultLocale: TranslationExtension = null;

  /**
   * SetUp test environment.
   */
  beforeEach(() => {
    extension = new TranslationExtension({
      translations: {
        de_DE: {
          MSG_HELLO: 'Hallo',
        },
        en_EN: {
          MSG_HELLO: 'Hello',
        },
      },
      defaultLocale: 'en_EN',
    });
    extensionMissingDefaultLocale = new TranslationExtension({
      translations: {
        de_DE: {
          MSG_HELLO: 'Hallo',
        },
        en_EN: {
          MSG_HELLO: 'Hello',
        },
      },
      defaultLocale: 'fr_FR',
    });
  });

  /**
   * Test that extension supports all suggested types.
   */
  it('supports suggested tags', () => {
    expect(extension.tags).toContain('trans');
  });

  /**
   * Test that the parser works correctly.
   */
  it('parses correctly', () => {
    const nextTokenMock = jest.fn(() => {
      return { value: 'token_value' };
    });
    const parseSignatureMock = jest.fn(() => ['arg1', 'arg2']);
    const advanceAfterBlockEndMock = jest.fn();
    const parseUntilBlocksMock = jest.fn(() => 'MSG_HELLO');
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

  /**
   * Test translation for DE locale.
   */
  it('translates correctly for de_DE locale', () => {
    expect(extension.trans({}, 'de_DE', () => 'MSG_HELLO')).toEqual({
      length: 5,
      val: 'Hallo',
    });
  });

  /**
   * Test translation for EN locale.
   */
  it('translates correctly for en_EN locale', () => {
    expect(extension.trans({}, 'en_EN', () => 'MSG_HELLO')).toEqual({
      length: 5,
      val: 'Hello',
    });
  });

  /**
   * Test translation fallback to default EN locale on missing locale param.
   */
  it('translates correctly with fallback to default en_EN locale', () => {
    expect(extension.trans({}, undefined, () => 'MSG_HELLO')).toEqual({
      length: 5,
      val: 'Hello',
    });
  });

  /**
   * Test translation with fallback to default EN locale.
   */
  it('translates correctly with fallback to default en_EN locale', () => {
    expect(extension.trans({}, 'fr_FR', () => 'MSG_HELLO')).toEqual({
      length: 5,
      val: 'Hello',
    });
  });

  /**
   * Test returning translation key if no translation found.
   */
  it('returns translation key on missing translation entry', () => {
    expect(extension.trans({}, 'de_DE', () => 'MSG_UNKNOWN')).toEqual({
      length: 11,
      val: 'MSG_UNKNOWN',
    });
  });

  /**
   * Test returning translation key if locale and default locale not found.
   */
  it('returns translation key if locale and default locale not found', () => {
    expect(
      extensionMissingDefaultLocale.trans({}, 'es_ES', () => 'MSG_UNKNOWN'),
    ).toEqual({
      length: 11,
      val: 'MSG_UNKNOWN',
    });
  });
});
