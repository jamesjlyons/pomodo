import React, { useEffect } from 'react';
import '../styles/globals.css';

function printAsciiArt() {
  const asciiArt = `
    ________  _____ ______   ________  ________
   |\   __  \|\   _ \  _   \|\   ___ \|\   __  \
   \ \  \|\  \ \  \\\__\ \  \ \  \_|\ \ \  \|\  \
    \ \   ____\ \  \\|__| \  \ \  \ \\ \ \   _  _\
     \ \  \___|\ \  \    \ \  \ \  \_\\ \ \  \\  \|
      \ \__\    \ \__\    \ \__\ \_______\ \__\\ _\
       \|__|     \|__|     \|__|\|_______|\|__|\|__|
  `;
  console.log(asciiArt);
}


// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    printAsciiArt();
  }, []);
  return <Component {...pageProps} />;
}
