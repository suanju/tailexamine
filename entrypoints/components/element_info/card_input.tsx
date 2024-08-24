import { useState } from "react";
import { useMouseStore } from "@/entrypoints/store/global";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { ChangeEvent, KeyboardEvent } from "react";

export default () => {
    const { element, setElement } = useMouseStore();
    const [inputValue, setInputValue] = useState<string>("");

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        // 移除空格
        const value = e.target.value.replace(/\s+/g, '');
        setInputValue(value);
    };

    const handleButtonClick = () => {
        if (element) {
            if (!inputValue) return false;
            element?.classList.add(inputValue);
            setInputValue("");
            //重新计算高亮位置
            setElement(element);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue) {
            handleButtonClick();
        }
    };

    return (
        <div className="h-10 px-2  w-full flex items-center justify-center">
            <div className="w-full flex items-center justify-center">
                <Input
                    className="h-6 flex-1 text-white"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                {inputValue ?
                    <Button className="ml-2 w-4" size="small" type="primary" icon={<CheckOutlined />} shape="round" onClick={handleButtonClick} />
                    : null}
            </div>
        </div>
    );
};
