import { useState } from "react";
import { ElementInfoId } from "@/entrypoints/components/element_info/element_info";
import { useMouseStore } from "@/entrypoints/store/mouse";
import useDynamicStyles from '@/entrypoints/hooks/use_dynamic_styles';
import { Select, Space } from "antd";
import { getColorFromRule } from "@/utlis/tools";
import { options, rules } from "./rule";

const optionRender = (option: any) => {
    const { isColor, color } = getColorFromRule(option.data.descr);
    console.log(option.data.descr,isColor,color)
    return (
        <Space>
            <span role="img" aria-label={option.data.label} className="flex items-center">
                {isColor ? <div className="size-4 rounded-md" style={{backgroundColor: color as string}}>
                </div> : <i className="i-system-uicons-code mr-.4 size-4 c-slate"></i>}
                <span className="ml-1.2 hover:text-blue-500">{option.data.label}</span>
            </span>
            <span className="ml-2 text-sm text-neutral overflow-hidden whitespace-nowrap hover:overflow-auto ">
                {isColor}{color}
                {option.data.descr}
            </span>
        </Space>
    );
};

export default () => {
    const { element, setElement } = useMouseStore();
    const { addStyle } = useDynamicStyles();
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    const handleSelect = (value: string) => {
        if (element) {
            element.classList.add(value);
            const styleRule = rules[value as keyof typeof rules];
            if (styleRule) addStyle(value, styleRule);
            setSelectedValue(null);
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
                    optionRender={optionRender}
                    value={selectedValue}
                    onSelect={handleSelect}
                />
            </div>
        </div>
    );
};