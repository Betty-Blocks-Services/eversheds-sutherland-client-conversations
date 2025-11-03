(() => ({
  name: 'OneSignal',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { env, useText } = B;
    const { appId, debugLogging } = options;

    const isDev = env === 'dev';
    const appIdText = useText(appId);

    function addScript(url, callback) {
      if (url) {
        const script = document.createElement('script');
        script.src = url;
        if (callback && typeof callback === 'function') {
          script.onload = callback;
        }
        document.head.appendChild(script);
      }
    }

    const url = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';

    useEffect(() => {
      if (isDev) return;

      addScript(url, () => {
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        window.OneSignalDeferred.push(async (OneSignal) => {
          if (debugLogging) {
            OneSignal.Debug.setLogLevel('trace');
          }
          await OneSignal.init({
            appId: appIdText,
          });
        });
      });

      if (!window.OneSignalDeferred) return;

      B.defineFunction('Enable push notifications', () => {
        window.OneSignalDeferred.push((OneSignal) => {
          \
          OneSignal.User.PushSubscription.optIn();
        });
      });

      B.defineFunction('Disable push notifications', () => {
        window.OneSignalDeferred.push((OneSignal) => {
          OneSignal.User.PushSubscription.optOut();
        });
      });

      window.OneSignalDeferred.push((OneSignal) => {
        B.triggerEvent('onInit', OneSignal.User.PushSubscription.optedIn);
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
