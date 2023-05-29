function merge<T = any>(arr1: any[], arr2: any[], type?: string): T[] {
  const seen = new Set();

  const data = [...arr1, ...arr2];

  const result = data.filter((el) => {
    const value = type ? el[type] : el;
    const duplicate = seen.has(value);
    seen.add(value);
    return !duplicate;
  });

  return result;
}

export default merge;
