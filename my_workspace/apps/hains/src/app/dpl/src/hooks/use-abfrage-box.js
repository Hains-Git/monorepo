import { useEffect, useRef, useState } from "react";

export const UseAbfrageBox = () => {
  const [style, setStyle] = useState({
    opacity: 0
  });
  const myRef = useRef(null);

  useEffect(() => {
    if (myRef && myRef.current) {
      let {
        width,
        height
      } = myRef.current.getBoundingClientRect();
      const h = window.innerHeight;
      const w = window.innerWidth;
      if (width > w) {
        width = w - 10;
      }
      if (height > h) {
        height = h - 10;
      }
      setStyle((current) => ({
        ...current,
        top: (h - height) / 2,
        left: (w - width) / 2,
        width,
        height,
        opacity: 1
      }));
    }
  }, [myRef]);

  return [
    style,
    myRef
  ];
};
