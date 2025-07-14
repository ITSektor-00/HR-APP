import React, { useRef } from 'react';

interface ResizeHandleProps {
  onResizeStart: (startX: number) => void;
  onResize: (deltaX: number) => void;
  onResizeEnd: () => void;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onResizeStart, onResize, onResizeEnd }) => {
  const dragging = useRef(false);

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    dragging.current = true;
    const startX = e.clientX;
    onResizeStart(startX);

    function onMouseMove(ev: MouseEvent) {
      if (!dragging.current) return;
      onResize(ev.clientX - startX);
    }
    function onMouseUp() {
      dragging.current = false;
      onResizeEnd();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  return (
    <div
      className="absolute top-0 right-0 h-full w-2 cursor-col-resize z-[99999]"
      onMouseDown={onMouseDown}
      style={{ userSelect: 'none' }}
    />
  );
};

export default ResizeHandle; 