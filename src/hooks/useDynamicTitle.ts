import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import type { UserData } from '../types';

export const useDynamicTitle = () => {
  const userDataRaw = useSelector((state: RootState) => state.user.userData);

  useEffect(() => {
    let userData: UserData | null = null;

    if (typeof userDataRaw === 'string') {
      try {
        userData = JSON.parse(userDataRaw);
      } catch {
        userData = null;
      }
    } else {
      userData = userDataRaw;
    }

    if (userData?.app_name) {
      document.title = `Dash.Operación | ${userData.app_name}`;
    } else {
      document.title = 'Dash.Operación';
    }

    if (userData?.favicon_url) {
      let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = userData.favicon_url;
    }
  }, [userDataRaw]);
};
