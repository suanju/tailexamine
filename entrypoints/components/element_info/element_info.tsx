import ElementInfoCard from "./element_card";
import { useElementCardStore } from "@/entrypoints/store/element_card";

export const ElementInfoId = "element-info";

export default () => {
    const { elementCardPosition } = useElementCardStore();
    return (
        <div
            id={ElementInfoId}
            className={`absolute flex justify-center items-center font-xs overflow-auto z-[9999]`}
            style={{
                left: `${elementCardPosition.left}px`,
                top: `${elementCardPosition.top}px`,
            }}
        >
            <ElementInfoCard></ElementInfoCard>
        </div>
    );
};
