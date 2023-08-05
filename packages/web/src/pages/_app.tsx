import type { AppProps } from 'next/app';
import Head from 'next/head';

import { config } from '#pkg/config';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{config.productName}</title>
    </Head>

    <Component {...pageProps} />
  </>
);

export default MyApp;
