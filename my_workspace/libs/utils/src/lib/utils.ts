/**
 * Processes an array of data items and maps them to a hash object based on a specified key.
 *
 * @param hashKey - The key to be used for mapping the objects. Defaults to 'id'.
 * @param dataArr - The array of data items to be processed.
 * @param cbs - An optional array of callback functions to process each data item.
 * @returns A hash object where each key is an id from the data array, and the value is the processed data item.
 */
export function processData<T>(hashKey: keyof T = 'id' as keyof T, dataArr: T[], cbs?: ((data: T) => T)[]) {
  return dataArr.reduce((hashObj: Record<string | number, T>, dataItem: T) => {
    let processedItem = dataItem;

    if (Array.isArray(cbs)) {
      processedItem = cbs.reduce((item, cb) => cb(item), dataItem);
    }

    const key = processedItem[hashKey];
    if (key !== undefined && (typeof key === 'string' || typeof key === 'number')) {
      hashObj[key] = processedItem;
    }

    return hashObj;
  }, {});
}

export async function processAsyncData<T>(
  hashKey: keyof T = 'id' as keyof T,
  dataArr: T[],
  cbs: ((data: T) => T | Promise<T>)[] = []
): Promise<Record<string | number, T>> {
  const processItem = async (item: T): Promise<T> => {
    let processedItem = item;
    for (const cb of cbs) {
      processedItem = await Promise.resolve(cb(processedItem));
    }
    return processedItem;
  };

  const processedItems = await Promise.all(dataArr.map(processItem));

  return processedItems.reduce(
    (hashObj, item) => {
      const key = item[hashKey];
      if (key !== undefined && (typeof key === 'string' || typeof key === 'number')) {
        hashObj[key] = item;
      }
      return hashObj;
    },
    {} as Record<string | number, T>
  );
}

export function convertStringToSnakeCase(str: string) {
  return str.toLowerCase().replace(/[-\s]+/g, '_');
}

export function convertBereichPlanname(data: any) {
  const converted_planname = convertStringToSnakeCase(data.planname);
  data['converted_planname'] = `b-${converted_planname}`;
  return data;
}

export function convertDienstPlanname(data: any) {
  const converted_planname = convertStringToSnakeCase(data.planname);
  data['converted_planname'] = `d-${converted_planname}`;
  return data;
}

/**
 * Maps an array of objects to a hash object based on a specified key.
 *
 * @param data - The array of objects to be mapped.
 * @param hashObjKey - The key to be used for mapping the objects. Defaults to 'id'.
 * @param keys - An array of keys whose values will be collected into arrays in the hash object.
 * @returns A hash object where each key is an id from the data array, and the value is an object
 *          containing arrays of values for the specified keys.
 * @example a returned hash: `{ '1': { key1: [value1, value2], key2: [value3] }, '2': { key1: [value4] } }`
 *
 */
export function mapIdToKeys<T extends Record<string, any>, K extends keyof T = keyof T>(
  data: T[],
  hashObjKey: K = 'id' as K,
  keys: (K | 'obj')[] = [] // Allow 'obj' as a valid key
): Record<T[K] & (string | number), Partial<Record<K | 'obj', T[]>>> {
  // Change T to T[]
  return data.reduce(
    (hashObj: Record<T[K] & (string | number), Partial<Record<K | 'obj', T[]>>>, dataItem: T) => {
      const id = dataItem[hashObjKey];
      if (id !== undefined && (typeof id === 'string' || typeof id === 'number')) {
        if (!hashObj[id]) {
          hashObj[id] = {} as Partial<Record<K | 'obj', T[]>>; // Initialize as an empty object
        }
        keys.forEach((key) => {
          if (!hashObj[id][key]) {
            hashObj[id][key] = [];
          }
          if (key !== 'obj') {
            const value = dataItem[key];
            if (value !== undefined && !hashObj[id][key].includes(value)) {
              (hashObj[id][key] as T[]).push(value);
            }
          } else {
            hashObj[id][key].push(dataItem);
          }
        });
      }
      return hashObj;
    },
    {} as Record<T[K] & (string | number), Partial<Record<K | 'obj', T[]>>> // Initialize correctly
  );
}
