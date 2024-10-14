import React, { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import '../styles/globals.css';
// import PlausibleProvider from 'next-plausible';
// import { Analytics } from '@vercel/analytics/react';
// import { Toaster, toast } from 'sonner';
import { OpenPanelComponent } from '@openpanel/nextjs';

function printAsciiArt() {
  const asciiArt = `
    ________  _____ ______   ________  ________\r\n   |\\   __  \\|\\   _ \\  _   \\|\\   ___ \\|\\   __  \\\r\n   \\ \\  \\|\\  \\ \\  \\\\\\__\\ \\  \\ \\  \\_|\\ \\ \\  \\|\\  \\\r\n    \\ \\   ____\\ \\  \\\\|__| \\  \\ \\  \\ \\\\ \\ \\   _  _\\\r\n     \\ \\  \\___|\\ \\  \\    \\ \\  \\ \\  \\_\\\\ \\ \\  \\\\  \\|\r\n      \\ \\__\\    \\ \\__\\    \\ \\__\\ \\_______\\ \\__\\\\ _\\\r\n       \\|__|     \\|__|     \\|__|\\|_______|\\|__|\\|__|

           ----- POMODORO AT YOUR SERVICE -----
    `;
  console.log(asciiArt);
}

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    printAsciiArt();
  }, []);
  return (
    <ThemeProvider themes={['light', 'dark', 'arc']} defaultTheme="dark">
      <OpenPanelComponent
        clientId="6c32975d-7f33-468b-b684-8024cb40a3f8"
        trackScreenViews={true}
        trackAttributes={true}
        trackOutgoingLinks={true}
        // If you have a user id, you can pass it here to identify the user
        // profileId={'123'}
      />
      {/* <PlausibleProvider domain="pomodoro.jameslyons.design"> */}
      {/* <Toaster /> */}
      <Component {...pageProps} />
      {/* <Analytics /> */}
      {/* </PlausibleProvider> */}
    </ThemeProvider>
  );
}
