// app/components/Counter.tsx
"use client";
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface CounterProps {
  end: number;
  duration: number;
  suffix?: string;
}

export default function Counter({ end, duration, suffix = '' }: CounterProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  useEffect(() => {
    let animationFrameId: number;
    
    if (inView) {
      const startTime = performance.now();
      
      const updateCount = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(updateCount);
        }
      };
      
      animationFrameId = requestAnimationFrame(updateCount);
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [inView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}