import methodName from "./methodName";

export default function methodsNames(methods) {
    if (Array.isArray(methods)) return methods.map(methodName);

    return Object.keys(methods);
}