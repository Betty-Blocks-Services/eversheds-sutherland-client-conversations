(() => ({
  name: 'OneSignal',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { env, useText } = B;
    const { appId } = options;

    const isDev = env === 'dev';
    const appIdText = useText(appId);

    function addScript(content, type = 'url') {
      if (content) {
        var script = document.createElement('script');
        if (content.startsWith('http')) {
          script.src = url;
        } else {
          script.textContent = content;
        }
        document.head.appendChild(script);
      }
    }

    const url = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';

    console.log({ isDev, appIdText });
    useEffect(() => {
      if (isDev) return;

      addScript(url);
      addScript(
        `
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        window.OneSignalDeferred.push(async function (OneSignal) {
          await OneSignal.init({
            appId: String("${appIdText}").trim(),
          });
        });
      `,
        'script',
      );

      B.defineFunction('Enable push notifications', () => {
        window.OneSignalDeferred.push(function (OneSignal) {
          OneSignal.Notifications.requestPermission();
          OneSignal.User.PushSubscription.optIn();
        });
      });

      B.defineFunction('Disable push notifications', () => {
        window.OneSignalDeferred.push(function (OneSignal) {
          OneSignal.User.PushSubscription.optOut();
        });
      });

      B.defineFunction('Show push notification prompt', () => {
        const status = Notification.permission;

        if (status === 'default') {
          window.OneSignalDeferred.push(async function (OneSignal) {
            await OneSignal.Notifications.requestPermission();
          });
        } else if (status === 'granted') {
          alert('Notifications already granted');
        } else if (status === 'denied') {
          alert('Notifications blocked');
        }
      });
    }, []);

    if (isDev) {
      return <div className={classes.pristine}>ONE SIGNAL</div>;
    }

    return <></>;
  })(),
  styles: () => () => ({
    pristine: {
      height: '50px',
      width: '100%',
      borderColor: 'rgb(175, 181, 200)',
      borderStyle: 'dashed',
      borderWidth: '0.0625rem',
      backgroundColor: 'rgb(240, 241, 245)',
      textAlign: 'center',
      fontSize: '0.75rem',
      color: 'rgb(38, 42, 58)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
}))();
