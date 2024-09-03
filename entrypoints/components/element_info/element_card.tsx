import React, { useState, useEffect, useRef } from 'react';
import "@/public/css/element_info/index.css";
import CardHead from "./card_head";
import CardInput from "./card_input";
import { Badge, Card, Checkbox, CheckboxOptionType, GetProp, Tag } from 'antd';
import { getElementStructure } from "@/utlis/tools";
import { useMouseStore } from "@/entrypoints/store/mouse";
import { CloseCircleOutlined } from "@ant-design/icons";

export default () => {
    const { element, setElement } = useMouseStore();
    const [plainOptions, setPlainOptions] = useState<CheckboxOptionType[]>([]);
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const [hoveredTag, setHoveredTag] = useState<string | null>(null); // 用于跟踪悬停的标签
    const optionsRef = useRef(plainOptions);
    const checkedRef = useRef(checkedList);
    const elementRef = useRef(element);

    useEffect(() => {
        if (element) {
            // dom 变化 CheckedList 重置
            setCheckedList([]);
            const updateOptions = () => {
                const toggleOffClass = element.dataset.toggleOffClass;
                const toggleOffClassArr = toggleOffClass?.split(' ');
                if (elementRef.current !== element) {
                    setPlainOptions([]);
                    if (element) {
                        const newOptions = Array.from([...element.classList, ...[toggleOffClass ? toggleOffClassArr : []].flat()]).map((className) => ({
                            label: className,
                            value: className,
                        }));
                        setPlainOptions(newOptions);
                    }
                    elementRef.current = element;
                } else if (elementRef.current === element) {
                    // 同一个 dom class 有更新
                    elementRef.current.classList.forEach(className => {
                        if (!optionsRef.current.some(option => option.value === className)) {
                            setPlainOptions(prevOptions => [...prevOptions, { label: className, value: className }]);
                        }
                    });
                }
            };

            updateOptions();
            const observer = new MutationObserver(() => {
                updateOptions();
            });

            observer.observe(element, { attributes: true, attributeFilter: ['class'] });
            return () => observer.disconnect();
        }
    }, [element]);

    useEffect(() => {
        optionsRef.current = plainOptions;
        checkedRef.current = checkedList;
        const toggleOffClass = element?.dataset.toggleOffClass;
        const opList = optionsRef.current.map(op => op.value);
        // 获取新增的 class
        const addChecked = opList.filter(item => !checkedRef.current.includes(item));
        setCheckedList(prevChecked => {
            return [...prevChecked, ...addChecked.filter(item => !toggleOffClass?.split(' ').includes(item))];
        });
    }, [element, plainOptions]);

    const handleCheckboxGroupChange: GetProp<typeof Checkbox.Group<string>, 'onChange'> = (list) => {
        // 进行更新 class
        if (element) {
            // 将取消的 class 插入 toggle-off-class
            const classList = Array.from(element?.classList);
            const toggleOffClass = element.dataset.toggleOffClass;
            const diffClassListToList = classList.filter(className => !list.includes(className));
            const diffListToClassList = list.filter(className => !classList.includes(className));
            // 添加新增 toggleOffClass class
            if (diffClassListToList.length) {
                const className = diffClassListToList.toString();
                console.log("添加", className);
                element.dataset.toggleOffClass = toggleOffClass ? `${toggleOffClass} ${className}` : className;
            }
            // 删除失效 toggleOffClass class
            if (diffListToClassList.length) {
                diffListToClassList.forEach(className => {
                    element.dataset.toggleOffClass = toggleOffClass?.split(' ').filter(item => className !== item).join(" ");
                });
            }
            // 重置 class
            element.classList.value = '';
            list.forEach(className => {
                element.classList.add(className as string);
            });
            // 重新计算高亮位置
            setElement(element);
        }
        setCheckedList(list);
    };

    const handleTagClose = (removedOption: string) => {
        console.log("close", removedOption);
        // 删除实体 element 的 class toggleOffClass
        if (element) {
            element.classList.remove(removedOption);
            const toggleOffClass = element.dataset.toggleOffClass;
            const toggleOffClassArr = toggleOffClass?.split(' ');
            if (toggleOffClassArr?.includes(removedOption)) {
                element.dataset.toggleOffClass = toggleOffClassArr.filter(item => item !== removedOption).join(" ");
            }
        }
        // 修改选项列表和已选中列表
        setPlainOptions(plainOptions.filter(option => option.value !== removedOption));
        setCheckedList(prev => prev.filter(option => option !== removedOption));
    };

    const handleMouseEnter = (value: string) => {
        setHoveredTag(value);
    };

    const handleMouseLeave = () => {
        setHoveredTag(null);
    };

    return (
        <Card
            bordered={false}
            className="w-84 h-92 rounded-md overflow-hidden bg-slate-900 text-white"
        >
            <CardHead />
            <div className="flex h-72 flex-col overflow-hidden items-start text-white bg-slate-900">
                <div>
                    {element ? (
                        <div className="mt-2 mx-2 flex flex-wrap items-baseline h-70 overflow-y-auto overflow-x-hidden"
                            un-scrollbar="~ track-color-gray-800 thumb-color-[#374151] w-4px rounded radius-10px">
                            <Checkbox.Group
                                value={checkedList}
                                onChange={handleCheckboxGroupChange}
                            >
                                <div className="flex w-full mb-1.8">
                                    {getElementStructure(element)}
                                </div>
                                {plainOptions.map(option => (
                                    <div
                                        className='flex flex-grow-1 mb-2'
                                        key={option.value}
                                        onMouseEnter={() => handleMouseEnter(option.value)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <Badge count={hoveredTag === option.value ? <CloseCircleOutlined className="size-3" onClick={() => handleTagClose(option.value)} /> : null}>
                                            <Tag
                                                color="#253044"
                                            >
                                                <Checkbox value={option.value}>
                                                    {option.label}
                                                </Checkbox>
                                            </Tag>
                                        </Badge>
                                    </div>
                                ))}
                            </Checkbox.Group>
                        </div>
                    ) : 'No element selected'}
                </div>
            </div>
            <CardInput />
        </Card>
    );
};
