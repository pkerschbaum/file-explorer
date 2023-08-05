import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  public override render() {
    return (
      // set translate="no" to disallow translation (https://stackoverflow.com/questions/12238396/how-to-disable-google-translate-from-html-in-chrome)
      <Html lang="en" translate="no">
        <Head>
          {/* disallow translation for Google (https://stackoverflow.com/questions/12238396/how-to-disable-google-translate-from-html-in-chrome) */}
          <meta name="google" content="notranslate" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
