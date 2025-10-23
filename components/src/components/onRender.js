(() => ({
  name: 'OnRender',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { useText, env } = B;
    const isDev = env === 'dev';
    useEffect(() => {
      B.triggerEvent('onRender');
    }, []);
    return isDev ? <div className={classes.root}>onRender</div> : <></>;
  })(),
  styles: () => () => ({
    root: {
      height: '50px',
      borderColor: 'rgb(175, 181, 200)',
      borderStyle: 'dashed',
      borderWidth: '0.0625rem',
      backgroundColor: 'rgb(240, 241, 245)',
      color: 'rgb(38, 42, 58)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
}))();
