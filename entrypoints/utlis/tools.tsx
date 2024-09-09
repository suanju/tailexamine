import { Breadcrumb } from "antd";

/**
 * 获取元素的结构信息
 * 
 * 该函数旨在提取给定HTML元素的标签名及其父元素的标签名如果存在的话
 * 它用于生成一个面包屑导航组件，显示元素的层级结构
 * 
 * @param element HTML元素或null
 * @returns 如果元素无效，返回字符串'Invalid element'；否则，返回面包屑导航组件或字符串，表示元素的结构信息
 */
export const getElementStructure = (element: HTMLElement | null) => {
    if (!element || !(element instanceof HTMLElement)) {
        return 'Invalid element';
    }
    const currentTag = element.tagName.toLowerCase();
    const parentElement = element.parentElement;
    const parentTag = parentElement ? parentElement.tagName.toLowerCase() : '';
    if (parentTag) {
        return (
            <Breadcrumb
                className="text-white"
                separator=">"
                items={[
                    {
                        title: parentTag,
                    },
                    {
                        title: currentTag,
                    },
                ]}
            />
        )
    } else {
        return currentTag;
    }
}

/**
 * 从规则字符串中提取颜色信息
 * 
 * 此函数用于解析给定的规则字符串（例如CSS规则），尝试从中提取出颜色值
 * 它会查找字符串中符合rgb、rgba或rgb(a)格式的颜色，并返回找到的颜色信息
 * 
 * @param rule 待解析的规则字符串
 * @returns 如果找到颜色值，则返回一个包含isColor为true和颜色值color的对象；
 *          如果未找到颜色值，则返回一个包含isColor为false和color为null的对象
 */
export const getColorFromRule = (rule: string) => {
    // 定义一个正则表达式，用于匹配rgb、rgba或rgb(a)格式的颜色字符串
    const colorRegex = /(?:rgb|rgba|rgb[a]?)\(([^)]+)\)/i;
    const match = rule.match(colorRegex);
    if (match) {
        return { isColor: true, color: match[0] };
    }
    return { isColor: false, color: null };
};

/**
 * 计算滚动条的宽度
 * 
 * 通过减去窗口的内宽度与文档元素的客户端宽度的差值来获取滚动条的宽度
 * 这个函数假设滚动条在右侧，并且在垂直滚动条显示时其宽度是恒定的
 * 
 * @returns {number} 滚动条的宽度（以像素为单位）
 */
export const getScrollbarWidth = (): number => {
    return window.innerWidth - document.documentElement.clientWidth;
}