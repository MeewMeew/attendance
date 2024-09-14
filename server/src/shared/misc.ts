export function cloneWithoutKey<T extends Record<string, any>>(obj: T, keyToExclude: keyof T): Omit<T, typeof keyToExclude> {
  const clonedObj = {} as Omit<T, typeof keyToExclude>;

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && key !== keyToExclude) {
      // @ts-ignore
      clonedObj[key as keyof Omit<T, typeof keyToExclude>] = obj[key];
    }
  }

  return clonedObj;
}