import { useEffect, useState } from "react";

export const UseMounted = () => {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    setMounted(() => true);
    return () => setMounted(() => false);
  }, []);

  return mounted;
};
