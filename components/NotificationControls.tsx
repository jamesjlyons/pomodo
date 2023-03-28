'use client';
import { useState, useEffect } from 'react';

export default function NotificationControls({ notifEnabled, setNotifEnabled }) {
  const [notifPerm, setNotifPerm] = useState('unknown');

  function setNotifPermState(value: string) {
    setNotifPerm(value);
  }

  function checkNotificationPromise() {
    try {
      Notification.requestPermission().then((value) => {
        setNotifPermState(value);
      });
    } catch (e) {
      return false;
    }
    return true;
  }

  function handleNotificationPermissions() {
    checkNotificationPromise();
  }

  function checkNotificationPermission() {
    if (!('Notification' in window)) {
      // Check if the browser supports notifications
      setNotifPerm('not supported');
    } else {
      // Set current permission state
      setNotifPermState(Notification.permission);
    }
  }

  function toggleNotifications() {
    setNotifEnabled((prevNotifEnabled) => !prevNotifEnabled);
  }

  useEffect(() => {
    const onPageLoad = () => {
      checkNotificationPermission();
    };

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);

  return (
    <div className="notificationControls" style={{ marginTop: 8 }}>
      {notifPerm === 'unknown' && (
        <span style={{ fontSize: 12, opacity: 0.5 }}>
          Checking notification permissions...
        </span>
      )}
      {notifPerm === 'default' && (
        <button onClick={handleNotificationPermissions}>
          Enable notifications
        </button>
      )}
      {notifPerm === 'granted' && (
        <form>
          <input
            name="notifications"
            type="checkbox"
            checked={notifEnabled}
            onChange={toggleNotifications}
          />
          <label htmlFor="notifications" style={{ marginLeft: 4, opacity: 0.5 }}>
            Enable notifications
          </label>
        </form>
      )}
      {notifPerm === 'denied' && (
        <span style={{ fontSize: 12, opacity: 0.5 }}>
          Notifications are disabled
        </span>
      )}
      {notifPerm === 'not supported' && (
        <span style={{ fontSize: 12, opacity: 0.5 }}>
          Notifications are not supported in this browser
        </span>
      )}
    </div>
  );
}
