import { useEffect, useCallback } from 'react';
import { useMouseStore } from "@/entrypoints/store/mouse";
import ElementInfoCard from "./element_card";
import { useElementCardStore } from "@/entrypoints/store/element_card";

export const ElementInfoId = "element-info";
const cardWidth = 336;
const cardHeight = 200; // 假设卡片的高度为 200px

const useCardFollow = (setElementCardPosition: (top: number, left: number) => void) => {
    const { isListeningMouse } = useMouseStore();

    const handleMouseMove = useCallback((event: MouseEvent) => {
        requestAnimationFrame(() => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const offset = 40;
            
            // 判断左右半屏
            const isLeftSide = event.pageX < windowWidth / 2;
            // 判断上下半屏
            const isTopSide = event.pageY < windowHeight / 2;

            // 根据鼠标位置决定卡片的 left 值
            const left = isLeftSide
                ? event.pageX + offset
                : event.pageX - offset - cardWidth;
            // 根据鼠标位置决定卡片的 top 值
            const top = isTopSide
                ? event.pageY + offset
                : event.pageY - offset - cardHeight;

            setElementCardPosition(top, left);
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
