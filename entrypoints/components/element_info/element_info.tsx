import { useEffect, useCallback } from 'react';
import { useMouseStore } from "@/entrypoints/store/mouse";
import ElementInfoCard from "./element_card";
import { useElementCardStore } from "@/entrypoints/store/element_card";

export const ElementInfoId = "element-info";
const cardWidth = 336;

const useCardFollow = (setElementCardPosition: (top: number, left: number) => void) => {
    const { isListeningMouse } = useMouseStore();

    const handleMouseMove = useCallback((event: MouseEvent) => {
        requestAnimationFrame(() => {
            const windowWidth = window.innerWidth;
            const offset = 40;
            // 判断左右半屏
            const isLeftSide = event.pageX < windowWidth / 2;
            // 根据鼠标位置决定卡片的 left 值
            const left = isLeftSide
                ? event.pageX + offset
                : event.pageX - offset - cardWidth;
            setElementCardPosition(event.pageY + offset, left);
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
