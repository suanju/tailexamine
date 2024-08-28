import { useState } from "react";
import { useMouseStore } from "@/entrypoints/store/mouse";
import { ElementInfoId } from "./element_info";
import { Select, Space } from "antd";
import { options } from "./rule";
import { KeyboardEvent } from "react";

export default () => {
    const { element, setElement } = useMouseStore();
    const [searchValue, setSearchValue] = useState<string>("");

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        console.log("keydown", e.key, searchValue);
        if (e.key === 'Enter' && searchValue) {
            handleButtonClick();
        }
    };

    const handleSelect = (value: string) => {
        console.log("-----", value);
        setSearchValue(value);
        handleButtonClick();
    };

    const handleButtonClick = () => {
        if (element && searchValue) {
            element.classList.add(searchValue);
            setSearchValue(""); // 清空搜索框
            setElement(element);
        }
    };

    return (
        <div className="h-10 px-2 w-full flex items-center justify-center">
            <div className="mx-.4 w-full h-6 flex items-center justify-center">
                <Select
                    showSearch
                    className="flex-1"
                    placement="topLeft"
                    getPopupContainer={() => document.getElementById(ElementInfoId) as HTMLElement}
                    options={options}
                    optionRender={(option) => (
                        <Space>
                            <span role="img" aria-label={option.data.label}>
                                {option.data.label}
                            </span>
                            {option.data.descr}
                        </Space>
                    )}
                    value={searchValue}
                    onKeyDown={handleKeyDown}
                    onSelect={handleSelect}
                    onSearch={setSearchValue}
                />
            </div>
        </div>
    );
};
