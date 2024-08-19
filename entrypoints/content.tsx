import "antd/dist/reset.css";
import { createRoot } from "react-dom/client";
import ElementHighlighter from "./components/spotlight/spotlight";
import ElementInfo from "./components/element_info/element_info";
import { useMouseStore } from './store/global';

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
  useEffect(() => {
    if (isListeningMouse) {
      const handleMouseMove = (event: MouseEvent) => {
        // console.log(event.clientX, event.clientY)
        // 更新鼠标信息
        setElement(event.target as HTMLElement)
        setLastEvent(event)
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
      e.preventDefault();
      setLastEvent(e);
      setPosition(e.clientX, e.clientY);
      setIsListeningMouse(!isListeningMouse); // 切换监听状态
    };
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [isListeningMouse, setIsListeningMouse]);
};

const App = () => {
  const { element } = useMouseStore()
  useMouseListener()
  return (
    <>
      {element ? (
        <div>
          <ElementHighlighter />
          <ElementInfo />
        </div>
      ) : null}
    </>
  );
};
