import { useCallback, useRef } from 'react';

export function useWindowResize({ width, height, minSize, onResize, onResizeEnd }) {
  const stateRef = useRef(null);

  const clamp = useCallback((w, h) => ({
    width: Math.max(minSize?.width ?? 200, w),
    height: Math.max(minSize?.height ?? 150, h),
  }), [minSize]);

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    stateRef.current = { startX: e.clientX, startY: e.clientY, startWidth: width, startHeight: height };

    const onPointerMove = (moveEvent) => {
      const s = stateRef.current;
      if (!s) return;
      const next = clamp(s.startWidth + (moveEvent.clientX - s.startX), s.startHeight + (moveEvent.clientY - s.startY));
      onResize(next);
    };

    const onPointerUp = (upEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      const s = stateRef.current;
      stateRef.current = null;
      if (!s) return;
      const next = clamp(s.startWidth + (upEvent.clientX - s.startX), s.startHeight + (upEvent.clientY - s.startY));
      onResizeEnd?.(next);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }, [width, height, clamp, onResize, onResizeEnd]);

  return { onPointerDown };
}
