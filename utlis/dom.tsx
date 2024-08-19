export const getElementStructure = (element: Element | null) => {
    if (!element || !(element instanceof Element)) {
        return 'Invalid element';
    }
    const currentTag = element.tagName.toLowerCase();
    const parentElement = element.parentElement;
    const parentTag = parentElement ? parentElement.tagName.toLowerCase() : '';

    if (parentTag) {
        return `${parentTag} > ${currentTag}`;
    } else {
        return currentTag;
    }
}