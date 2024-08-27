import { useElementCardStore } from "@/entrypoints/store/element_card";
import { useMouseStore } from "@/entrypoints/store/mouse";
import { CloseOutlined, CopyOutlined, FullscreenOutlined, NodeExpandOutlined, NumberOutlined, SnippetsOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useRef, useEffect, useCallback, useState } from "react";

export default () => {
    const { setElement, setIsListeningMouse } = useMouseStore();
    const { elementCardPosition, setElementCardPosition, isMove, setIsMove } = useElementCardStore();
    const dragStartRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [isTipsOpen, setIsTipsOpen] = useState(false);

    const updatePosition = useCallback((e: MouseEvent) => {
        if (isMove) {
            const { clientX, clientY } = e;
            //减少重绘次数
            requestAnimationFrame(() => {
                setElementCardPosition(clientY - dragStartRef.current.y, clientX - dragStartRef.current.x);
            });
        }
    }, [isMove, setElementCardPosition]);

    //开始拖拽
    const cleanupListeners = useCallback(() => {
        setIsTipsOpen(false)
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', updatePosition);
        document.removeEventListener('mouseup', handleMouseUp);

    }, [updatePosition]);
    
    //结束拖拽
    const addListeners = useCallback(() => {
        setIsTipsOpen(true)
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
        setIsDragging(prev => !prev);
    }, [isDragging, elementCardPosition.left, elementCardPosition.top, setIsMove, addListeners, cleanupListeners]);

    useEffect(() => {
        if (isDragging) {
            addListeners();
        } else {
            setIsTipsOpen(true)
            cleanupListeners();
        }
        return cleanupListeners;
    }, [isDragging, addListeners, cleanupListeners]);

    const close = () => {
        setElement(null);
        setIsListeningMouse(true);
    };

    return (
        <div id="element-card-head" className="h-10 px-1.4 flex items-center bg-[#1F2937]">
            <div className="flex flex-1 mr-1.4">
                <div className="flex justify-center bg-[#374151] w-20 h-7 rounded-md overflow-hidden">
                    <div className="w-10 flex items-center justify-center bg-[#4096FF]"><NumberOutlined /></div>
                    <div className="w-10 flex items-center justify-center"><NodeExpandOutlined /></div>
                </div>
            </div>
            <div className="flex">
                <Tooltip placement="top" title={isTipsOpen ? '' : 'Copy classes'} arrow={true}>
                    <CopyOutlined className="mr-.4 size-6" />
                </Tooltip>
                <Tooltip placement="top" title={isTipsOpen ? '' : 'Copy element'} arrow={true}>
                    <SnippetsOutlined className="mr-.4 size-6" />
                </Tooltip>
                <Tooltip placement="top" title={isTipsOpen ? '' : 'Move window'} arrow={true}>
                    <FullscreenOutlined
                        className="mr-.4 size-6"
                        onClick={toggleDragMode}
                    />
                </Tooltip>
                <Tooltip placement="topRight" title={isTipsOpen ? '' : 'Close window'} arrow={true}>
                    <CloseOutlined onClick={close} className="size-6" />
                </Tooltip>
            </div>
        </div>
    );
};
