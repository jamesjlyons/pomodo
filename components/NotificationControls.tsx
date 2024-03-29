import { useState, useEffect } from 'react';
import * as Switch from '@radix-ui/react-switch';

type NotificationControlsProps = {
  notifEnabled: boolean;
  setNotifEnabled: (enabled: boolean) => void;
};

export default function NotificationControls({
  notifEnabled,
  setNotifEnabled,
}: NotificationControlsProps) {
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

  // function toggleNotifications() {
  //   setNotifEnabled((prevNotifEnabled) => !prevNotifEnabled);
  // }

  const toggleNotifications = () => {
    setNotifEnabled(!notifEnabled);
  };

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
    <div className="notificationControls">
      {notifPerm === 'unknown' && (
        <span style={{ fontSize: 12, opacity: 0.5 }}>
          Checking notification permissions...
        </span>
      )}
      {notifPerm === 'default' && (
        <button className="button" onClick={handleNotificationPermissions}>
          Enable notifications
        </button>
      )}
      {notifPerm === 'granted' && (
        <div>
          {/* <form
            style={{
              fontSize: 13,
              marginTop: 16,
              display: 'flex',
              alignItems: 'center',
            }}>
            <input
              name="notifications"
              type="checkbox"
              checked={notifEnabled}
              onChange={toggleNotifications}
            />
            <label htmlFor="notifications" style={{ marginLeft: 4, opacity: 0.5 }}>
              Enable notifications
            </label>
          </form> */}

          <form>
            <div className="switch">
              <label className="Label" htmlFor="notifications">
                Notifications
              </label>
              <Switch.Root
                className="SwitchRoot"
                id="notifications"
                checked={notifEnabled}
                onCheckedChange={() => setNotifEnabled(!notifEnabled)}
              >
                <Switch.Thumb className="SwitchThumb" />
              </Switch.Root>
            </div>
          </form>
        </div>
      )}
      {notifPerm === 'denied' && <span>Notifications are disabled</span>}
      {notifPerm === 'not supported' && (
        <span>Notifications are not supported in this browser</span>
      )}
    </div>
  );
}
