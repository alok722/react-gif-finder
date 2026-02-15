import { useState, useCallback } from 'react';

const LIGHT = {
  app: 'App',
  title: 'title',
  icon: 'fa fa-toggle-off',
  text: '',
};

const DARK = {
  app: 'DarkApp',
  title: 'darkTitle',
  icon: 'fa fa-toggle-on',
  text: 'pDarkMode',
};

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  const toggle = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const theme = isDark ? DARK : LIGHT;

  return { isDark, toggle, theme };
};

export default useDarkMode;
