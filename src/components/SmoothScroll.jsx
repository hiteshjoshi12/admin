import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false, // DISABLE smooth touch to let native momentum scroll work on mobile
      touchMultiplier: 2,
    });

    // 2. Connect Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 3. GSAP Ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // 4. Disable lag smoothing to prevent jumps
    gsap.ticker.lagSmoothing(0);

    // 5. Force a refresh to ensure start/end positions are correct
    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return <div style={{ width: '100%', overflow: 'hidden' }}>{children}</div>;
}