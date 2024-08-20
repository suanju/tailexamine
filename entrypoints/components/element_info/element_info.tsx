import ElementInfoCard from "./element_card";
import { useMouseStore } from "@/entrypoints/store/global";

export const ElementInfoId = "element-info";

export default () => {
    const { position } = useMouseStore();
    return (
        <div
            id={ElementInfoId}
            className={`fixed flex justify-center items-center font-xs overflow-auto z-[9999]`}
            style={{
                left: `${position.x + 40}px`,
                top: `${position.y + 40}px`,
            }}
        >
            <ElementInfoCard></ElementInfoCard>
        </div>
    );
};
