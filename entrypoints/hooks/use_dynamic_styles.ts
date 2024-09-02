import { useEffect, useRef } from "react";

function useDynamicStyles() {
    // 用于存储动态 style 标签的引用
    const styleSheetRef = useRef<CSSStyleSheet | null>(null);

    useEffect(() => {
        // 在组件挂载时创建一个 style 标签并插入到文档的 head 中
        const styleElement = document.createElement("style");
        styleElement.setAttribute("id", "dynamic-styles");
        document.head.appendChild(styleElement);
        styleSheetRef.current = styleElement.sheet as CSSStyleSheet;

        // 在组件卸载时移除 style 标签
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    // 检查是否存在某个样式规则
    const hasStyle = (className: string): boolean => {
        if (styleSheetRef.current) {
            const rules = styleSheetRef.current.cssRules;
            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i] as CSSStyleRule;
                if (rule.selectorText === `.${className}`) {
                    return true;
                }
            }
        }
        return false;
    };

    // 添加新的样式规则
    const addStyle = (className: string, rules: string) => {
        if (!hasStyle(className)) {
            if (styleSheetRef.current) {
                console.log("进行规则添加", className, rules);
                // CSS.escape 对 className 进行转义
                const escapedClassName = CSS.escape(className);
                const rule = `.${escapedClassName} { ${rules} }`;
                styleSheetRef.current.insertRule(rule, styleSheetRef.current.cssRules.length);
            }
        }
    };

    // 删除样式规则
    const removeStyle = (className: string) => {
        if (styleSheetRef.current) {
            const rules = styleSheetRef.current.cssRules;
            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i] as CSSStyleRule;
                if (rule.selectorText === `.${className}`) {
                    styleSheetRef.current.deleteRule(i);
                    break;
                }
            }
        }
    };

    return { addStyle, removeStyle };
}

export default useDynamicStyles;
