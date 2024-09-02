import 'virtual:uno.css';
import "antd/dist/reset.css";
import { createRoot } from "react-dom/client";
import ElementHighlighter from "./components/spotlight/spotlight";
import ElementInfo, { ElementInfoId } from "./components/element_info/element_info";
import { useMouseStore } from '@/entrypoints/store/mouse';
import { ConfigProvider } from 'antd';
import { useEffect, useCallback } from 'react';

export default defineContentScript({
  matches: ['*://*/*'],
  main(ctx) {
    console.log('init content', ctx);
    const root = document.createElement("div");
    document.body.appendChild(root);
    createRoot(root).render(
      <App />
    );
  },
});

// 监听鼠标的自定义 Hook
const useMouseListener = () => {
  const { element, setElement, setLastEvent, setPosition, isListeningMouse, setIsListeningMouse } = useMouseStore();
  
  const handleMouseMove = useCallback((event: MouseEvent) => {
    // 更新鼠标信息
    if (element !== event.target) {
      setElement(event.target as HTMLElement);
      setPosition(event.clientX, event.clientY);
      setLastEvent(event);
    }
  }, [element, setElement, setLastEvent, setPosition]);

  const handleClick = useCallback((e: MouseEvent) => {
    if (!document.getElementById(ElementInfoId)?.contains(e.target as Node)) {
      e.stopPropagation(); // 冒泡
      e.stopImmediatePropagation(); // 其他监听器
      e.preventDefault(); // 默认行为
      setLastEvent(e);
      setPosition(e.clientX, e.clientY);
      setIsListeningMouse(!isListeningMouse);
    }
  }, [isListeningMouse, setLastEvent, setPosition, setIsListeningMouse]);

  useEffect(() => {
    if (isListeningMouse) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isListeningMouse, handleMouseMove]);

  useEffect(() => {
    window.addEventListener('click', handleClick, true);
    return () => {
      window.removeEventListener('click', handleClick, true);
    };
  }, [handleClick]);
};

const App = () => {
  console.log("加载 App");
  const { element } = useMouseStore();

  useMouseListener(); // 在组件内调用自定义 Hook

  return (
    <>
      {element ? (
        <ConfigProvider
          theme={{
            token: {
              colorText: '#fff',
              colorTextSecondary: '#fff',
              colorBgBase: '#334155',
              colorBgContainer: '#334155',
              colorBorder: '#334155',
            },
            components: {
              Input: {
                colorBgContainer: '#334155',
                colorBorder: '#334155',
                activeBg: '#334155',
                activeBorderColor: "#334155"
              },
              Breadcrumb: {
                colorText: '#fff',
                separatorColor: "#fff"
              },
              Select:{
                optionActiveBg: '#1e293b',
                optionSelectedBg: '#1e293b',
                optionSelectedColor: '#fff',
              }
            },
          }}
        >
          <div>
            <ElementHighlighter />
            <ElementInfo />
          </div>
        </ConfigProvider>
      ) : null}
    </>
  );
};
