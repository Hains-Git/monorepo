import { useEffect } from "react";

export const UseChannel = (user, appModel, channel, page, key) => {
  const unsubscribe = () => {
    user?.unsubscribe?.(key);
  };

  const subscribe = () => {
    user?.subscribe?.(channel(page), key);
  };

  useEffect(() => {
    if (user && appModel && page) {
      subscribe();
    }

    return () => {
      unsubscribe();
    };
  }, [user, appModel, channel, page, key]);

  return { subscribe, unsubscribe };
}