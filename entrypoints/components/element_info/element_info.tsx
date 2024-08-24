import ElementInfoCard from "./element_card";
import { useMouseStore } from "@/entrypoints/store/global";

export const ElementInfoId = "element-info";

export default () => {
    const { lastEvent } = useMouseStore();
    return (
        <div
            id={ElementInfoId}
            className={`absolute flex justify-center items-center font-xs overflow-auto z-[9999]`}
            style={{
                left: `${lastEvent.pageX + 40}px`,
                top: `${lastEvent.pageY + 40}px`,
            }}
        >
            <ElementInfoCard></ElementInfoCard>
        </div>
    );
};
