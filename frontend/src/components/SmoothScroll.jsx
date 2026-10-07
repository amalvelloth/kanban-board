import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      smoothWheel: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;
