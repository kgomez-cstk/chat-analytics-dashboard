import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../features/user/userSlice';
import type { RootState } from '../app/store';
import type { PostMessagePayload, UserData } from '../types';

export const usePostMessage = () => {
  const dispatch = useDispatch();
  const isInitialized = useSelector((state: RootState) => state.user.isInitialized);
  const initRef = useRef(false);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      let payload = event.data;

      // If payload is a string, try to parse it first
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch {
          // Keep as string if not valid JSON
        }
      }

      const isObject = payload && typeof payload === 'object';

      // 1. Handle structured format (Object with type)
      if (isObject && 'type' in payload) {
        const msg = payload as PostMessagePayload;

        if (msg.type === 'INIT' && !initRef.current) {
          initRef.current = true;
          if (msg.data) {
            dispatch(setUserData(msg.data as UserData | string));
          }
          return;
        }

        if (msg.type === 'CLOSE_DASH') {
          window.close();
          return;
        }
      }

      // 2. Handle legacy format (Object or String with user fields)
      if (!initRef.current) {
        if (isObject && (payload.id_usuario || payload.token)) {
          initRef.current = true;
          dispatch(setUserData(payload as UserData));
          return;
        }
      }
    },
    [dispatch]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    // Notify parent or opener that dashboard is ready
    const notifyReady = () => {
      const readyMsg = { type: 'DASH_READY' };
      // Try both parent (for iframes) and opener (for popups)
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(readyMsg, '*');
      }
      if (window.opener) {
        window.opener.postMessage(readyMsg, '*');
      }
    };

    // Small delay to ensure everything is mounted
    const timer = setTimeout(notifyReady, 500);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
    };
  }, [handleMessage]);

  return { isInitialized };
};
