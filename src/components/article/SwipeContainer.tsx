import { useRef, useEffect, ReactNode, useState } from "react";

interface SwipeContainerProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const SwipeContainer = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 120,
  className = "",
  style,
}: SwipeContainerProps) => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const contentKeyRef = useRef(0);

  useEffect(() => {
    let isActive = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      isActive = true;
      setIsSwiping(true);
      setTranslateX(0);
      setSwipeDirection(null);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isActive) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - touchStartX.current;
      const deltaY = currentY - touchStartY.current;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // 只有当水平滑动距离明显大于垂直滑动距离时，才进行视觉反馈
      if (absDeltaX > absDeltaY && absDeltaX > 10) {
        // 限制滑动距离，避免过度滑动
        const maxSwipe = 200;
        const limitedDeltaX = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
        setTranslateX(limitedDeltaX);

        // 设置滑动方向
        if (deltaX > 0) {
          setSwipeDirection("right");
        } else {
          setSwipeDirection("left");
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX.current = e.changedTouches[0].clientX;
      touchEndY.current = e.changedTouches[0].clientY;
      isActive = false;
      handleSwipe();
    };

    const handleSwipe = () => {
      const deltaX = touchStartX.current - touchEndX.current;
      const deltaY = touchStartY.current - touchEndY.current;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // 只有当水平滑动距离明显大于垂直滑动距离时，才触发翻页
      if (absDeltaX > absDeltaY && absDeltaX > threshold) {
        if (deltaX > 0 && onSwipeLeft) {
          // 向左滑动，翻到下一页
          triggerSwipeAnimation("left", onSwipeLeft);
        } else if (deltaX < 0 && onSwipeRight) {
          // 向右滑动，翻到上一页
          triggerSwipeAnimation("right", onSwipeRight);
        } else {
          // 滑动距离不够，回弹
          resetSwipeAnimation();
        }
      } else {
        // 不是有效的滑动，回弹
        resetSwipeAnimation();
      }
    };

    const triggerSwipeAnimation = (
      direction: "left" | "right",
      callback: () => void
    ) => {
      // 完成滑动动画，让旧页面滑出
      const finalTranslate =
        direction === "left" ? -window.innerWidth : window.innerWidth;
      setIsTransitioning(true);
      setTranslateX(finalTranslate);

      // 等待动画完成（旧页面完全滑出）
      setTimeout(() => {
        // 先设置新内容从相反方向进入的位置（在内容更新之前）
        const enterTranslate =
          direction === "left" ? window.innerWidth : -window.innerWidth;
        setTranslateX(enterTranslate);

        // 增加 key 值，强制重新渲染
        contentKeyRef.current += 1;

        // 然后执行回调更新内容
        // 使用 requestAnimationFrame 确保位置设置完成后再更新内容
        requestAnimationFrame(() => {
          callback();

          // 等待新内容渲染完成后再滑入
          setTimeout(() => {
            setTranslateX(0);
            setIsSwiping(false);
            setIsTransitioning(false);
            setSwipeDirection(null);
          }, 50); // 给 React 一些时间完成渲染
        });
      }, 250); // 稍微延长一点时间，确保动画完全完成
    };

    const resetSwipeAnimation = () => {
      // 回弹动画
      setTranslateX(0);
      setTimeout(() => {
        setIsSwiping(false);
        setSwipeDirection(null);
      }, 300);
    };

    const containerElement = containerRef.current;
    if (containerElement) {
      containerElement.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      containerElement.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
      containerElement.addEventListener("touchend", handleTouchEnd, {
        passive: true,
      });
    }

    return () => {
      if (containerElement) {
        containerElement.removeEventListener("touchstart", handleTouchStart);
        containerElement.removeEventListener("touchmove", handleTouchMove);
        containerElement.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [threshold, onSwipeLeft, onSwipeRight]);

  // 计算不透明度，滑动距离越大，当前页面越透明
  const opacity =
    isSwiping && Math.abs(translateX) > 20
      ? Math.max(0.3, 1 - Math.abs(translateX) / 300)
      : 1;

  // 计算阴影，滑动时显示阴影效果
  const boxShadow =
    isSwiping && Math.abs(translateX) > 20
      ? `0 ${Math.abs(translateX) / 10}px ${
          Math.abs(translateX) / 5
        }px rgba(0, 0, 0, ${Math.min(0.3, Math.abs(translateX) / 500)})`
      : "none";

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ touchAction: "pan-y", ...style }}
    >
      <div
        key={contentKeyRef.current}
        ref={contentRef}
        className="transition-all ease-out"
        style={{
          transitionDuration: isTransitioning ? "250ms" : "200ms",
          transform: `translateX(${translateX}px)`,
          opacity: isTransitioning ? 1 : opacity,
          boxShadow: isTransitioning ? "none" : boxShadow,
          willChange:
            isSwiping || isTransitioning ? "transform, opacity" : "auto",
        }}
      >
        {children}
      </div>

      {/* 滑动指示器 */}
      {isSwiping && Math.abs(translateX) > 30 && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
          <div className="bg-black/50 dark:bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 text-white dark:text-black text-sm font-medium">
            {swipeDirection === "left" ? "下一页 →" : "← 上一页"}
          </div>
        </div>
      )}
    </div>
  );
};
