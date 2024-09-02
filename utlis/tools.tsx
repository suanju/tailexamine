import { Breadcrumb } from "antd";

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

export const getColorFromRule = (rule: string) => {
    const colorRegex = /(?:rgb|rgba|rgb[a]?)\(([^)]+)\)/i;
    const match = rule.match(colorRegex);
    console.log(match)
    if (match) {
        return { isColor: true, color: match[0] };
    }
    return { isColor: false, color: null };
}
