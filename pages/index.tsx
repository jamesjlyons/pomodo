// import Image from 'next/image';
// import styles from '../styles/page.module.css';
import Head from 'next/head';
// import Script from 'next/script';

import PomodoroGPT from 'components/PomodoroGPT';


function HomePage() {
  return (
    <div className="App">
      <Head>
        <title>Pomodo</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="description" content="⏲️" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Script src="/timer-worker.js" strategy="worker" /> */}
      <PomodoroGPT />
    </div>
  );
}

export default HomePage;
