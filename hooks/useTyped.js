import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

export const useTyped = (strings, options = {}) => {
  const elRef = useRef(null);
  const typedRef = useRef(null);

  useEffect(() => {
    if (elRef.current) {
      const typed = new Typed(elRef.current, {
        strings,
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1000,
        loop: true,
        showCursor: true,
        cursorChar: '|',
        ...options
      });
      
      typedRef.current = typed;

      return () => {
        typed.destroy();
      };
    }
  }, [strings, options]);

  return elRef;
};
