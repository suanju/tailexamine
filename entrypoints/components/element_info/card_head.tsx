import { useElementCardStore } from "@/entrypoints/store/element_card";
import { useMouseStore } from "@/entrypoints/store/mouse";
import { CloseOutlined, CopyOutlined, FullscreenOutlined, NodeExpandOutlined, NumberOutlined, SnippetsOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useRef, useEffect, useCallback, useState } from "react";
import { throttle } from 'radash';

export default () => {
    const { element, setElement, setIsListeningMouse } = useMouseStore();
    const { elementCardPosition, setElementCardPosition, isMove, setIsMove } = useElementCardStore();
    const dragStartRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [isTipsOpen, setIsTipsOpen] = useState(false);
    const [tooltipText, setTooltipText] = useState({ copyClasses: 'Copy classes', copyElement: 'Copy element', moveWindow: 'Move window', closeWindow: 'Close window' });

    const updatePosition = useCallback((e: MouseEvent) => {
        if (isMove) {
            const { clientX, clientY } = e;
            //减少重绘次数
            requestAnimationFrame(() => {
                setElementCardPosition(clientY - dragStartRef.current.y, clientX - dragStartRef.current.x);
            });
        }
    }, [isMove, setElementCardPosition]);

    const cleanupListeners = useCallback(() => {
        setIsTipsOpen(false);
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', updatePosition);
        document.removeEventListener('mouseup', handleMouseUp);
    }, [updatePosition]);

    const addListeners = useCallback(() => {
        setIsTipsOpen(true);
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', updatePosition);
        document.addEventListener('mouseup', handleMouseUp);
    }, [updatePosition]);

    const handleMouseUp = useCallback(() => {
        setIsMove(false);
        cleanupListeners();
    }, [cleanupListeners, setIsMove]);

    const toggleDragMode = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isDragging) {
            dragStartRef.current = {
                x: e.clientX - elementCardPosition.left,
                y: e.clientY - elementCardPosition.top,
            };
            setIsMove(true);
            addListeners();
        } else {
            setIsMove(false);
            cleanupListeners();
        }
        setIsDragging((prev) => !prev);
    }, [isDragging, elementCardPosition.left, elementCardPosition.top, setIsMove, addListeners, cleanupListeners]);

    // 窗口拖动
    useEffect(() => {
        if (isDragging) {
            addListeners();
        } else {
            setIsTipsOpen(true);
            cleanupListeners();
        }
        return cleanupListeners;
    }, [isDragging, addListeners, cleanupListeners]);

    // 关闭窗口
    const close = () => {
        // setElement(null);
        // setIsListeningMouse(true);
        // @ts-ignore
        window.removeTailexamine()
    };

    // 复制类名，使用节流
    const copyClasses = throttle({ interval: 2000 },
        () => {
            if (element) {
                const classNames = element.className;
                navigator.clipboard.writeText(classNames).then(() => {
                    setTooltipText((prev) => ({ ...prev, copyClasses: '☑️ Classes copied!' }));
                    setTimeout(() => {
                        setTooltipText((prev) => ({ ...prev, copyClasses: 'Copy classes' }));
                    }, 1000);
                });
            }
        }
    );

    // 复制完整元素，使用节流
    const copyElement = throttle({ interval: 2000 },
        () => {
            if (element) {
                const elementHtml = element.outerHTML;
                navigator.clipboard.writeText(elementHtml).then(() => {
                    setTooltipText((prev) => ({ ...prev, copyElement: '☑️ Element copied!' }));
                    setTimeout(() => {
                        setTooltipText((prev) => ({ ...prev, copyElement: 'Copy element' }));
                    }, 2000);
                });
            }
        }
    );

    return (
        <div id="element-card-head" className="h-10 px-1.4 flex items-center bg-[#1F2937]">
            <div className="flex flex-1 mr-1.4">
                <div className="flex justify-center bg-[#374151] w-20 h-7 rounded-md overflow-hidden">
                    <div className="w-10 flex items-center justify-center bg-[#4096FF]"><NumberOutlined /></div>
                    <div className="w-10 flex items-center justify-center"><NodeExpandOutlined /></div>
                </div>
            </div>
            <div className="flex">
                <Tooltip placement="top" title={isTipsOpen ? '' : tooltipText.copyClasses} arrow={true}>
                    <CopyOutlined className="mr-.4 size-6 flex justify-center hover:bg-[#4096FF] rounded-sm " onClick={copyClasses} />
                </Tooltip>
                <Tooltip placement="top" title={isTipsOpen ? '' : tooltipText.copyElement} arrow={true}>
                    <SnippetsOutlined className="mr-.4 size-6 flex justify-center hover:bg-[#4096FF] rounded-sm" onClick={copyElement} />
                </Tooltip>
                <Tooltip placement="top" title={isTipsOpen ? '' : tooltipText.moveWindow} arrow={true}>
                    <FullscreenOutlined
                        className="mr-.4 size-6 flex justify-center hover:bg-[#4096FF] rounded-sm"
                        onClick={toggleDragMode}
                    />
                </Tooltip>
                <Tooltip placement="topRight" title={isTipsOpen ? '' : tooltipText.closeWindow} arrow={true}>
                    <CloseOutlined onClick={close} className="size-6 flex justify-center hover:bg-[#4096FF] rounded-sm" />
                </Tooltip>
            </div>
        </div>
    );
};
