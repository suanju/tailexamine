import { useMouseStore } from "@/entrypoints/store/mouse";
import { CloseOutlined, CopyOutlined, NodeExpandOutlined, NumberOutlined, SnippetsOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

export default () => {
    const { setElement, setIsListeningMouse } = useMouseStore();
    // 关闭
    const close = () => {
        setElement(null)
        setIsListeningMouse(true);
    }
    return (
        <div className="h-10 px-1.4 flex items-center bg-[#1F2937]">
            <div className="flex flex-1 mr-1.4">
                <div className="flex justify-center bg-[#374151] w-20 h-7 rounded-md overflow-hidden">
                    <div className="w-10 flex items-center justify-center bg-[#4096FF]"><NumberOutlined /></div>
                    <div className="w-10 flex items-center justify-center "><NodeExpandOutlined /></div>
                </div>
            </div>
            <div className="flex">
                <Tooltip placement="top" title="Copy classes" arrow={true}>
                    <CopyOutlined className="mr-.4 size-6" />
                </Tooltip>
                <Tooltip placement="top" title="Copy element" arrow={true}>
                    <SnippetsOutlined className="mr-.4 size-6" />
                </Tooltip>
                <Tooltip placement="topRight" title="Close window" arrow={true}>
                    <CloseOutlined onClick={close} className="size-6" />
                </Tooltip>
            </div>
        </div>
    );
};  