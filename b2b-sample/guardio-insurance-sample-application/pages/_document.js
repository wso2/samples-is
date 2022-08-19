import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    const pageProps = this.props?.__NEXT_DATA__?.props?.pageProps;
    return (
      <Html>
        <Head />
        <body className={pageProps.session ? 'dark-mode' : 'light-mode'}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}