import { useMouseStore } from "@/entrypoints/store/mouse";
import { useEffect, useState } from "react";

export default () => {
  const [scrollTop, setScrollTop] = useState(window.scrollY);
  const [_, setHighlightRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [infoText, setInfoText] = useState<string>("");
  const [infoTextPosition, setInfoTextPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [lines, setLines] = useState<{
    x1: number; y1: number; x2: number; y2: number;
  }[]>([]);

  const { element, lastEvent } = useMouseStore();

  useEffect(() => {
    // console.log("进行重新计算 高亮线位置");
    const target = lastEvent.target as HTMLElement;
    if (target && target !== document.body && target !== document.documentElement) {
      const rect = target.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const dimensions = `${Math.round(rect.width)} x ${Math.round(rect.height)}`;

      setScrollTop(window.scrollY);

      setHighlightRect({
        x: rect.left + scrollX,
        y: rect.top + scrollY,
        width: rect.width,
        height: rect.height,
      });

      // 更新 infoTextPosition，文本在目标元素右上角
      setInfoText(`${dimensions}`);
      setInfoTextPosition({
        x: rect.right + scrollX - 4,
        y: rect.top + scrollY - 10,
      });

      setLines([
        { x1: rect.left + scrollX + 7, y1: 0, x2: rect.left + scrollX + 7, y2: window.innerHeight + scrollY },
        { x1: rect.right + scrollX + 7, y1: 0, x2: rect.right + scrollX + 7, y2: window.innerHeight + scrollY },
        { x1: 0, y1: rect.top - 5, x2: window.innerWidth + scrollX, y2: rect.top - 5 },
        { x1: 0, y1: rect.bottom + 5, x2: window.innerWidth + scrollX, y2: rect.bottom + 5 },
      ]);
    } else {
      setHighlightRect(null);
      setInfoText("");
      setLines([]);
    }
  }, [lastEvent, element?.className]);

  return (
    <div id="spotlight">
      <svg
        className="absolute z-[9999]"
        style={{ width: "100%", height: "100%", top: `${scrollTop}px`, left: 0, pointerEvents: "none" }}
        viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
      >
        {/* 信息文本 */}
        {infoText && (
          <text
            className="text-xs bg-slate-800"
            x={infoTextPosition.x}
            y={infoTextPosition.y}
            fill="#fff"
            fontFamily="Arial, sans-serif"
            textAnchor="end"
          >
            {infoText}
          </text>
        )}

        {/* 线条 */}
        {lines.map((line, index) => (
          <line
            key={index}
            stroke="#6171fe"
            strokeWidth="2"
            strokeDasharray="10,10"
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
          />
        ))}
      </svg>
    </div>
  );
};
