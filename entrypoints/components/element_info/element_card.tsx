import "./css/index.css"
import { Card, Checkbox, CheckboxOptionType, GetProp, Tag } from 'antd';
import { getElementStructure } from "@/utlis/dom";
import { useMouseStore } from "@/entrypoints/store/global";

// 自定义标题组件
const CustomTitle = () => {
    return (
        <div className="h-14 flex items-center">
        </div>
    );
};

export default () => {
    const { element } = useMouseStore();
    const [plainOptions, setPlainOptions] = useState<CheckboxOptionType[]>([]);
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const elementRef = useRef(element);

    useEffect(() => {
        if (elementRef.current !== element) {
            console.log("element 状态更新", element);
            setPlainOptions([]);
            if (element) {
                const newOptions = Array.from(element.classList).map((className) => ({
                    label: className,
                    value: className,
                }));
                setPlainOptions(newOptions);
            }
            elementRef.current = element;
        }
    }, [element]);

    useEffect(() => {
        setCheckedList(plainOptions.map(option => option.value));
    }, [plainOptions]);


    const handleCheckboxGroupChange: GetProp<typeof Checkbox.Group<string>, 'onChange'> = (list) => {
        console.log(list)
        //进行更新class
        if (element) {
            element.classList.value = '';
            list.forEach(className => {
                element.classList.add(className as string);
            });
        }
        setCheckedList(list);
    };

    const handleTagClose = (removedOption: string) => {
        setPlainOptions(plainOptions.filter(option => option.value !== removedOption));
        setCheckedList(prev => prev.filter(option => option !== removedOption));
    };



    return (
        <Card
            title={<CustomTitle />}
            bordered={false}
            className="w-75 h-92 rounded-md overflow-hidden bg-slate-900 text-white"
        >
            <div className="flex h-78 flex-col items-start text-white bg-slate-900">
                <div className="mx-2">
                    {getElementStructure(element)}
                </div>
                <div>
                    {element ? (
                        <div className="mt-4 flex flex-wrap items-start">
                            <Checkbox.Group
                                value={checkedList}
                                onChange={handleCheckboxGroupChange}
                            >
                                {plainOptions.map(option => (
                                    <Tag
                                        key={option.value}
                                        closable
                                        color="#253044"
                                        onClose={() => handleTagClose(option.value)}
                                    >
                                        <Checkbox value={option.value}>
                                            {option.label}
                                        </Checkbox>
                                    </Tag>
                                ))}
                            </Checkbox.Group>
                        </div>
                    ) : 'No element selected'}
                </div>
            </div>
        </Card>
    );
};