import React, { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import '../styles/globals.css';
import PlausibleProvider from 'next-plausible';
import { Analytics } from '@vercel/analytics/react';

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
    <ThemeProvider>
      <Component {...pageProps} />
      <Analytics />
    </ThemeProvider>
  );
}
