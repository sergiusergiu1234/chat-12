import { useEffect, useRef } from "react"

export const useOutsideHover = (callback: () => void) => {
    const ref = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
 
      const handleMouseLeave = () => {
        callback();
      };
  
      const element = ref.current;
  
      if (element) {
        element.addEventListener('mouseleave', handleMouseLeave);
      }
  
      return () => {
        if (element) {
          element.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
  
    }, [callback]);
  
    return ref;
  };







      
