import { useMouseStore } from "@/entrypoints/store/mouse";
import { useEffect, useState } from "react";
import { getScrollbarWidth } from "@/entrypoints/utlis/tools";

export default () => {
  const [scrollTop, setScrollTop] = useState(window.scrollY);
  const [highlightRect, setHighlightRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [infoText, setInfoText] = useState<string>("");
  const [infoTextPosition, setInfoTextPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  const { element, lastEvent } = useMouseStore();
  const [viewBox, setViewBox] = useState(`0 0 ${window.innerWidth} ${window.innerHeight}`);

  const updateLines = (rect: DOMRect) => {
    const right = rect.right;
    const left = rect.left;
    const top = rect.top;
    const bottom = rect.bottom;
    // 设置辅助线
    setLines([
      { x1: left, y1: 0, x2: left, y2: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) },
      { x1: right, y1: 0, x2: right, y2: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) },
      { x1: 0, y1: top, x2: Math.max(document.documentElement.clientWidth, document.body.clientWidth), y2: top },
      { x1: 0, y1: bottom, x2: Math.max(document.documentElement.clientWidth, document.body.clientWidth), y2: bottom },
    ]);
  };

  const updateHighlightAndLines = () => {
    const target = lastEvent?.target as HTMLElement;
    if (target && target !== document.body && target !== document.documentElement) {
      const rect = target.getBoundingClientRect();
      setScrollTop(window.scrollY);

      setHighlightRect({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });

      setInfoText(`${Math.round(rect.width)} x ${Math.round(rect.height)}`);
      setInfoTextPosition({
        x: rect.right - 4,
        y: rect.top - 10,
      });

      updateLines(rect);
    } else {
      setHighlightRect(null);
      setInfoText("");
      setLines([]);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth - getScrollbarWidth(), window.innerHeight);
      setViewBox(`0 0 ${window.innerWidth - getScrollbarWidth()} ${window.innerHeight}`);
      updateHighlightAndLines(); // 手动调用更新逻辑
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    updateHighlightAndLines(); // 使用提取的函数
  }, [lastEvent, element?.className]);

  return (
    <div id="spotlight">
      <svg
        className="absolute z-[9999]"
        style={{ width: "100%", height: "100%", top: `${scrollTop}px`, left: 0, pointerEvents: "none" }}
        viewBox={viewBox}
      >
        {/* 覆盖背景 */}
        {highlightRect && (
          <rect
            x={highlightRect.x}
            y={highlightRect.y}
            width={highlightRect.width}
            height={highlightRect.height}
            style={{ transition: "all 0.1s ease-in-out" }}
            fill="rgb(97 113 254 / 0.4)" // 半透明淡黄色背景
          />
        )}
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
