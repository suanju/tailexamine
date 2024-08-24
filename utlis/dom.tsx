export const getElementStructure = (element: HTMLElement | null) => {
    if (!element || !(element instanceof HTMLElement)) {
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