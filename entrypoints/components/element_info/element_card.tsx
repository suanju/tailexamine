import "./css/index.css"
import { Card, Checkbox, CheckboxOptionType, CheckboxProps, GetProp, Tag } from 'antd';
import { getElementStructure } from "@/utlis/dom";
import { useMouseStore } from "@/entrypoints/store/global";

interface ElementInfoCardProps {
    element: Element | null
}

// 自定义标题组件
const CustomTitle = () => {
    return (
        <div className="h-14 flex items-center">
        </div>
    );
};

export default (props: ElementInfoCardProps) => {
    const { element } = useMouseStore();
    const [plainOptions, setPlainOptions] = useState<CheckboxOptionType[]>([]);
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const elementRef = useRef(element);

    useEffect(() => {
        if (elementRef.current !== element) {
            console.log("状态更新");
            // 清空选项
            setPlainOptions([]);
            // 确保 classList 存在
            if (props.element?.classList) {
                const newOptions = Array.from(props.element.classList).map((className) => ({
                    label: className,
                    value: className,
                }));
                setPlainOptions(newOptions);
            }
            // 更新引用的 element
            elementRef.current = element;
        }
    }, [element, props.element?.classList]);

    useEffect(() => {
        setCheckedList(plainOptions.map(option => option.value));
    }, [plainOptions]);

    const handleCheckboxChange = (checkedValue: string, checked: boolean) => {
        if (checked) {
            setCheckedList(prev => [...prev, checkedValue]);
        } else {
            setCheckedList(prev => prev.filter(value => value !== checkedValue));
        }
    };

    const handleTagClose = (removedOption: string) => {
        setPlainOptions(plainOptions.filter(option => option.value !== removedOption));
        setCheckedList(checkedList.filter(option => option !== removedOption));
    };

    return (
        <Card
            title={<CustomTitle />}
            bordered={false}
            className="w-75 h-92 text-white"
        >
            <div className="flex h-78 flex-col items-start bg-slate-900 text-white">
                <div className="mx-2">
                    {getElementStructure(props.element)}
                </div>
                <div>
                    {props.element ?
                        <div className="mt-4">
                            {plainOptions.map(option => (
                                <Tag
                                    key={option.value}
                                    closable
                                    color="#253044"
                                    onClose={() => handleTagClose(option.value)}
                                    className="mb-1"
                                >
                                    <Checkbox
                                        value={option.value}
                                        checked={checkedList.includes(option.value)}
                                        onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                                    >
                                        {option.label}
                                    </Checkbox>
                                </Tag>
                            ))}
                        </div>
                        : 'No element selected'}
                </div>
            </div>
        </Card>
    );
};
