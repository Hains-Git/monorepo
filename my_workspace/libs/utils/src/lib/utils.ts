type HashObjType<T, IsArray extends boolean> = Record<string | number, IsArray extends true ? T[] : T>;
export const colorRegEx = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

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

/**
 * Processes an array of data items and maps them to a hash object based on a specified key.
 *
 * @param hashKey - The key to be used for mapping the objects. Defaults to 'id'.
 * @param dataArr - The array of data items to be processed.
 * @param cbs - An optional array of callback functions to process each data item.
 * @param isInArray - A flag to indicate whether the values in the hash object should be placed in a  array.
 * @returns A hash object where each key is an id from the data array, and the value is the processed data item.
 */
export function processData<T, IsArray extends boolean = false>(
  hashKey: keyof T = 'id' as keyof T,
  dataArr: T[],
  cbs?: ((data: T) => T)[],
  isInArray: IsArray = false as IsArray
): HashObjType<T, IsArray> {
  return dataArr.reduce((hashObj: HashObjType<T, IsArray>, dataItem: T) => {
    let processedItem = dataItem;

    if (Array.isArray(cbs)) {
      processedItem = cbs.reduce((item, cb) => cb(item), dataItem);
    }

    const key = processedItem[hashKey];
    if (key !== undefined && (typeof key === 'string' || typeof key === 'number')) {
      if (isInArray) {
        if (!Array.isArray(hashObj[key])) {
          (hashObj[key] as T[]) = [];
        }
        (hashObj[key] as T[]).push(processedItem);
      } else {
        (hashObj[key] as T) = processedItem;
      }
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

/**
 * Transforms an object by applying specified methods to create new or modify existing properties.
 *
 * @template T - The type of the input object.
 * @param {T} result - The original object to be transformed.
 * @param {Array<{key: string, method: TransformMethod<any>, path?: string}>} transforms - An array of transformation specifications.
 *   Each specification includes:
 *   - key: The name of the property to be added or modified.
 *   - method: A function that generates the value for the property.
 *   - path (optional): A dot-separated string indicating the nested path where the property should be added.
 *     An empty string or omitted path means the property will be added at the root level.
 * @returns {T} A new object with the specified transformations applied.
 *
 * @example
 * const result = await prisma.mitarbeiter.findUnique({
 *   where: { id: mitarbeiterId },
 *   include: { accountInfo: true }
 * });
 *
 * const transformedResult = transformObject(result, [
 *   {
 *     key: 'weiterbildungsjahr',
 *     method: addWeiterbildungsjahr,
 *     path: 'accountInfo'
 *   },
 *   {
 *     key: 'fullName',
 *     method: (data) => `${data.firstName} ${data.lastName}`
 *   }
 * ]);
 */
type TransformMethod<T, K extends keyof T = keyof T> = (data: T[K]) => T[K];

export function transformObject<T extends Record<string, any>, K extends string>(
  result: T,
  transforms: Array<{
    key: keyof T | K;
    method: TransformMethod<T, any>;
    path?: string;
  }>
): T & Record<K, any> {
  const transformed = { ...result } as T & Record<K, any>;

  transforms.forEach(({ key, method, path = '' }) => {
    const pathParts = path.split('.');
    let target: Record<string, any> = transformed;

    // Traverse the object to the specified path
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      if (part) {
        if (!(part in target)) {
          target[part] = {};
        }
        target[part] = { ...target[part] };
        target = target[part];
      }
    }

    // Apply the transformation
    const data = path ? (result as any)[path] : result;
    target[key as string] = method(data);
  });

  return transformed;
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

// export function newDate(tag: string | Date | number = ''): Date {
//   if (!tag) return new Date();
//   const dateRegEx = /^\d{4}-(0[1-9]|1[0-2])-\d{2}$/;
//   const date = new Date(tag);
//   // 12 Uhr, damit keine Probleme mit der Zeitzone entstehen
//   if (typeof tag === 'string' && dateRegEx.test(tag)) {
//     tag = new Date(`${tag}T12:00:00.000Z`);
//   }
//   return date;
// }

// export function newDateYearMonthDay(year: number, month: number, day: number): Date {
//   return new Date(year, month, day, 12);
// }
