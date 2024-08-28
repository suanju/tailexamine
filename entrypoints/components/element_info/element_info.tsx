import { useEffect, useCallback } from 'react';
import { useMouseStore } from "@/entrypoints/store/mouse";
import ElementInfoCard from "./element_card";
import { useElementCardStore } from "@/entrypoints/store/element_card";

export const ElementInfoId = "element-info";

const useCardFollow = (setElementCardPosition: (top: number, left: number) => void) => {
    const { isListeningMouse } = useMouseStore();
    const handleMouseMove = useCallback((event: MouseEvent) => {
        requestAnimationFrame(() => {
            setElementCardPosition(event.pageY + 40, event.pageX + 40);
        });
    }, [setElementCardPosition]);

    useEffect(() => {
        if (isListeningMouse) {
            window.addEventListener('mousemove', handleMouseMove);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
            };
        }
    }, [isListeningMouse, handleMouseMove]);
};

export default () => {
    console.log("组件加载 element_info");
    const { elementCardPosition, setElementCardPosition } = useElementCardStore();
    useCardFollow(setElementCardPosition);

    const style = {
        left: `${elementCardPosition.left}px`,
        top: `${elementCardPosition.top}px`,
    };

    return (
        <div
            id={ElementInfoId}
            className="absolute flex justify-center items-center font-xs overflow-auto z-[9999]"
            style={style}
        >
            <ElementInfoCard />
        </div>
    );
};