import { useRef, useEffect, ReactNode } from "react";

interface SwipeContainerProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  className?: string;
}

export const SwipeContainer = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 120,
  className = "",
}: SwipeContainerProps) => {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX.current = e.changedTouches[0].clientX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const distance = touchStartX.current - touchEndX.current;
      if (distance > threshold && onSwipeLeft) {
        onSwipeLeft();
      } else if (distance < -threshold && onSwipeRight) {
        onSwipeRight();
      }
    };

    const containerElement = containerRef.current;
    if (containerElement) {
      containerElement.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      containerElement.addEventListener("touchend", handleTouchEnd, {
        passive: true,
      });
    }

    return () => {
      if (containerElement) {
        containerElement.removeEventListener("touchstart", handleTouchStart);
        containerElement.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [threshold, onSwipeLeft, onSwipeRight]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};
