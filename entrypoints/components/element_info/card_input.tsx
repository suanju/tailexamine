import { useState, useEffect } from "react";
import { ElementInfoId } from "@/entrypoints/components/element_info/element_info";
import { useMouseStore } from "@/entrypoints/store/mouse";
import useDynamicStyles from '@/entrypoints/hooks/use_dynamic_styles';
import { Select, Space } from "antd";
import { getColorFromRule } from "@/entrypoints/utlis/tools";
import { options, rules } from "../../rule/rule";

const optionRender = (option: any) => {
    const { isColor, color } = getColorFromRule(option.data.descr);
    return (
        <Space>
            <span role="img" aria-label={option.data.label} className="flex justify-center">
                {isColor ? <div className="size-4 rounded-.8 border-2 border-white" style={{ backgroundColor: color as string }}>
                </div> : <i className="i-system-uicons-code mr-.4 size-4 c-slate"></i>}
                <span className="ml-1.2 hover:text-blue-500">{option.data.label}</span>
            </span>
            <span className="ml-2 text-xs text-neutral overflow-hidden whitespace-nowrap hover:overflow-auto ">
                {option.data.descr}
            </span>
        </Space>
    );
};

export default () => {
    const { element, setElement } = useMouseStore();
    const { addStyle } = useDynamicStyles();
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState<string>("");
    const [availableOptions, setAvailableOptions] = useState<any>(options);

    useEffect(() => {
        if (searchValue) {
            setAvailableOptions(options.filter((option) =>
                option.label.includes(searchValue) || option.descr.includes(searchValue)
            ));
        } else {
            setAvailableOptions([]);
        }
    }, [searchValue]);

    // 处理搜索框输入变化
    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    // 选中事件
    const handleSelect = (value: string) => {
        if (element) {
            element.classList.add(value);
            const styleRule = rules[value as keyof typeof rules];
            if (styleRule) addStyle(value, styleRule);
            setSelectedValue(null);
            setSearchValue("");
            setElement(element);
        }
    };

    return (
        <div className="h-10 px-2 w-full flex items-center justify-center bg-slate-900">
            <div className="mx-.2 w-full h-6 flex items-center justify-center">
                <Select
                    showSearch
                    className="flex-1"
                    placement="topLeft"
                    getPopupContainer={() => document.getElementById(ElementInfoId) as HTMLElement}
                    options={availableOptions}
                    optionRender={optionRender}
                    value={selectedValue || searchValue} // 绑定值改为搜索值，防止闪烁
                    onSearch={handleSearch}
                    onSelect={handleSelect}
                />
            </div>
        </div>
    );
};
