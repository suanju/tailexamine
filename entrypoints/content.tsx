import 'virtual:uno.css'
import "antd/dist/reset.css";
import { createRoot } from "react-dom/client";
import ElementHighlighter from "./components/spotlight/spotlight";
import ElementInfo, { ElementInfoId } from "./components/element_info/element_info";
import { useMouseStore } from '@/entrypoints/store/mouse';
import { useElementCardStore } from '@/entrypoints/store/element_card';
import { ConfigProvider } from 'antd';

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

//监听鼠标
const useMouseListener = () => {
  const { setElement, setLastEvent, setPosition, isListeningMouse, setIsListeningMouse } = useMouseStore();
  const { setElementCardPosition } = useElementCardStore()
  useEffect(() => {
    if (isListeningMouse) {
      const handleMouseMove = (event: MouseEvent) => {
        // 更新鼠标信息
        setElement(event.target as HTMLElement)
        setLastEvent(event)
        setElementCardPosition(event.pageY + 40, event.pageX + 40)
        setPosition(event.clientX, event.clientY);
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isListeningMouse, setPosition]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // 未点击卡片内重新进入审查状态
      if (!document.getElementById(ElementInfoId)?.contains(e.target as Node)) {
        e.stopPropagation(); //冒泡
        e.stopImmediatePropagation(); //其他监听器
        e.preventDefault(); //默认行为
        setLastEvent(e);
        setPosition(e.clientX, e.clientY);
        setIsListeningMouse(!isListeningMouse);
      }
    };
    window.addEventListener('click', handleClick, true);
    return () => {
      window.removeEventListener('click', handleClick, true);
    };
  }, [isListeningMouse, setIsListeningMouse]);
};

const App = () => {
  const { element } = useMouseStore()
  useMouseListener()
  return (
    <>
      {element ? (
        <ConfigProvider
          theme={{
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
