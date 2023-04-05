import React, { useEffect } from 'react';
import { Inter } from '@next/font/google'
const inter = Inter({ subsets: ['latin'] })
import '../styles/globals.css';

function printAsciiArt() {
  const asciiArt = `
    ________  _____ ______   ________  ________\r\n   |\\   __  \\|\\   _ \\  _   \\|\\   ___ \\|\\   __  \\\r\n   \\ \\  \\|\\  \\ \\  \\\\\\__\\ \\  \\ \\  \\_|\\ \\ \\  \\|\\  \\\r\n    \\ \\   ____\\ \\  \\\\|__| \\  \\ \\  \\ \\\\ \\ \\   _  _\\\r\n     \\ \\  \\___|\\ \\  \\    \\ \\  \\ \\  \\_\\\\ \\ \\  \\\\  \\|\r\n      \\ \\__\\    \\ \\__\\    \\ \\__\\ \\_______\\ \\__\\\\ _\\\r\n       \\|__|     \\|__|     \\|__|\\|_______|\\|__|\\|__|

           ----- PMDR TIMER AT YOUR SERVICE -----
    `;
  console.log(asciiArt);
}


// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    printAsciiArt();
  }, []);
  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  )
}
