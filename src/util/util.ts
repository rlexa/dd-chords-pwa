export const clearEmptyValues = <T extends object>(obj: T) =>
  Object.entries(obj)
    .filter(([key, val]) => !!key && ![null, undefined, ''].includes(val))
    .reduce<T>((acc, [key, val]) => Object.assign(acc, {[key]: val}), {} as T);

export const identity = <T>(item: T) => item;

export const jsonEqual = <T>(aa: T, bb: T) => aa === bb || JSON.stringify(aa) === JSON.stringify(bb);

export const mergeObjects = <T extends object>(objs: T[]) => objs.reduce<T>((acc, ii) => Object.assign(acc, ii), {} as T);

export const trackByIndex = (index: number) => index;
