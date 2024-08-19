import "./css/index.css"
import { Card, Checkbox, CheckboxOptionType, GetProp } from 'antd';
import { getElementStructure } from "@/utlis/dom";
import { useMouseStore } from "@/entrypoints/store/global";

interface ElementInfoCardProps {
    element: Element | null
}


// 自定义标题组件
const CustomTitle = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
        </div>
    );
};


export default (props: ElementInfoCardProps) => {
    const {element} = useMouseStore(); 
    const [plainOptions, setPlainOptions] = useState<CheckboxOptionType[]>([]);
     
    const elementRef = useRef(element);
    
    useEffect(() => {
        console.log("lastEvent 更新前的值:", elementRef.current);
        console.log("状态更新");
        setPlainOptions([]); // 清空选项

        // 使用索引保证 key 的唯一性
        props.element?.classList.forEach((className, index) => {
            setPlainOptions(prevPlainOptions => [
                ...prevPlainOptions, 
                { label: className, value: true, key: `${className}-${index}` } 
            ]);
        });

        elementRef.current = element;
    }, [element]);

    console.log(plainOptions)

    const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
        console.log('checked = ', checkedValues);
    };

    return (
        <Card
            title={<CustomTitle />}
            bordered={false}
            style={{ width: 300, height: 400, background: "#1D243D", color: "#fff" }}
        >
            <div style={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
                <div>
                    {getElementStructure(props.element)}
                </div>
                <div>
                    <Checkbox.Group options={plainOptions} defaultValue={['Apple']} onChange={onChange} />
                    {props.element ? props.element.classList.toString() : 'No element selected'}
                </div>
            </div>
        </Card>
    )
};
