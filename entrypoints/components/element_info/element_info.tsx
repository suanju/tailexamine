import { useState, useEffect } from "react"
import ElementInfoCard from "./element_card"
import { useMouseStore } from "@/entrypoints/store/global";

export default () => {
    const [elementInfo, setElementInfo] = useState<Element | null>(null)
    const { position } = useMouseStore();

    useEffect(() => {
        const element = document.elementFromPoint(position.x, position.y)
        if (element) {
            setElementInfo(element)
        } else {
            setElementInfo(null)
        }
    }, [position])

    return (
        <div
            id="element-info"
            style={{
                position: "fixed",
                left: `${position.x + 40}px`,
                top: `${position.y + 40}px`,
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "12px",
                overflow: "auto",
            }}
        >
            <ElementInfoCard element={elementInfo}></ElementInfoCard>
        </div>

    )
}
