import { useMouseStore } from "@/entrypoints/store/global";
import React, { useEffect, useState } from "react";



export default () => {
  const lineBaseStyle = "fixed z-[9997] border-2 border-dashed border-[#5766E3]";
  const infoBoxBaseStyle = "fixed z-[9999] bg-[rgba(0,0,0,0.7)] text-white p-1 rounded text-xs";
  const highlightBaseStyle = "fixed z-[9998] border-2 border-dashed border-[#5766E3]";
  const lineStyle = {
    border: "2px dashed #5766E3",
    background: "repeating-linear-gradient(90deg, #5766E3, #5766E3 4px, transparent 4px, transparent 8px)",
  };
  const verticalLineStyle = {
    ...lineStyle,
    background: "repeating-linear-gradient(180deg, #5766E3, #5766E3 4px, transparent 4px, transparent 8px)",
  };


  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
  const [infoBoxStyle, setInfoBoxStyle] = useState<React.CSSProperties>({});
  const [infoText, setInfoText] = useState<string>("");
  const [lineStyles, setLineStyles] = useState({
    topLeft: {} as React.CSSProperties,
    topRight: {} as React.CSSProperties,
    bottomLeft: {} as React.CSSProperties,
    bottomRight: {} as React.CSSProperties,
    leftTop: {} as React.CSSProperties,
    leftBottom: {} as React.CSSProperties,
    rightTop: {} as React.CSSProperties,
    rightBottom: {} as React.CSSProperties,
  });


  const { lastEvent } = useMouseStore();

  useEffect(() => {

    const updateHighlight = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();

      // 设置高亮框样式
      setHighlightStyle({
        left: `${rect.left + 2}px`,
        top: `${rect.top + 2}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        position: "fixed",
        zIndex: 9998,
        pointerEvents: "none",
      });

      // 更新信息框内容
      const tag = element.tagName.toLowerCase();
      const classList = element.classList.length > 0 ? `.${[...element.classList].join(".")}` : "";
      const id = element.id ? `#${element.id}` : "";
      const dimensions = `${Math.round(rect.width)} x ${Math.round(rect.height)}`;
      setInfoText(`${tag}${id}${classList} - ${dimensions}`);

      // 设置信息框样式
      setInfoBoxStyle({
        left: `${rect.left}px`,
        top: `${rect.top - 30}px`,
        position: "fixed",
        zIndex: 9999,
        pointerEvents: "none",
        display: "block",
      });

      updateLines(rect);
    };

    const updateLines = (rect: DOMRect) => {
      const pageWidth = window.innerWidth;
      const pageHeight = window.innerHeight;

      setLineStyles({
        topLeft: {
          left: "0px",
          top: `${rect.top}px`,
          width: `${rect.left}px`,
          height: "2px",
          ...lineStyle,
        },
        topRight: {
          left: `${rect.right}px`,
          top: `${rect.top}px`,
          width: `${pageWidth - rect.right}px`,
          height: "2px",
          ...lineStyle,
        },
        bottomLeft: {
          left: "0px",
          top: `${rect.bottom}px`,
          width: `${rect.left}px`,
          height: "2px",
          ...lineStyle,
        },
        bottomRight: {
          left: `${rect.right}px`,
          top: `${rect.bottom}px`,
          width: `${pageWidth - rect.right}px`,
          height: "2px",
          ...lineStyle,
        },
        leftTop: {
          left: `${rect.left}px`,
          top: "0px",
          width: "2px",
          height: `${rect.top}px`,
          ...verticalLineStyle,
        },
        leftBottom: {
          left: `${rect.left}px`,
          top: `${rect.bottom}px`,
          width: "2px",
          height: `${pageHeight - rect.bottom}px`,
          ...verticalLineStyle,
        },
        rightTop: {
          left: `${rect.right}px`,
          top: "0px",
          width: "2px",
          height: `${rect.top}px`,
          ...verticalLineStyle,
        },
        rightBottom: {
          left: `${rect.right}px`,
          top: `${rect.bottom}px`,
          width: "2px",
          height: `${pageHeight - rect.bottom}px`,
          ...verticalLineStyle,
        },
      });
    };

    const removeHighlight = () => {
      setHighlightStyle({ display: "none" });
      setInfoBoxStyle({ display: "none" });
      setLineStyles({
        topLeft: { display: "none" },
        topRight: { display: "none" },
        bottomLeft: { display: "none" },
        bottomRight: { display: "none" },
        leftTop: { display: "none" },
        leftBottom: { display: "none" },
        rightTop: { display: "none" },
        rightBottom: { display: "none" },
      });
    };

    const target = lastEvent.target as HTMLElement;
    if (target && target !== document.body && target !== document.documentElement) {
      updateHighlight(target);
    } else {
      removeHighlight();
    }

  }, [lastEvent]);

  return (
    <>
      <div id="spotlight">
        <div className={highlightBaseStyle} style={highlightStyle}></div>
        <div className={infoBoxBaseStyle} style={infoBoxStyle}>
          {infoText}
        </div>
        <div className={lineBaseStyle} style={lineStyles.topLeft}></div>
        <div className={lineBaseStyle} style={lineStyles.topRight}></div>
        <div className={lineBaseStyle} style={lineStyles.bottomLeft}></div>
        <div className={lineBaseStyle} style={lineStyles.bottomRight}></div>
        <div className={lineBaseStyle} style={lineStyles.leftTop}></div>
        <div className={lineBaseStyle} style={lineStyles.leftBottom}></div>
        <div className={lineBaseStyle} style={lineStyles.rightTop}></div>
        <div className={lineBaseStyle} style={lineStyles.rightBottom}></div>
      </div>
    </>
  );
};
