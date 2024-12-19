import { getter_routes } from '../datenbank/models';

type GroupResult = {
  data?: any;
  error?: any;
};

export type GroupResults = {
  [key: string]: {
    data?: any;
    error?: any;
  };
};

export type Route = {
  route: string;
  method: 'get' | 'post';
  data?: any;
};

export type Routes = Route[];

const groupedRequestBase = (
  hainsOAuth: any,
  routes: Route[] | (keyof typeof getter_routes)[],
  callback: (data: GroupResults) => void
) => {
  const result: GroupResults = {};
  const l = routes?.length;
  let c = 0;

  const addToResult = (key: string, res: GroupResult) => {
    result[key] = res;
    c++;
    if (c === l) {
      callback(result);
    }
  };

  if (!hainsOAuth?.api) return callback(result);
  routes?.forEach?.((route) => {
    const routeObj: Route =
      typeof route === 'string'
        ? {
            route: 'db_getter',
            method: 'get',
            data: {
              routeBase: getter_routes[route]
            }
          }
        : route;
    const key = typeof route === 'string' ? route : route.route;
    hainsOAuth.api(routeObj.route, routeObj.method, routeObj.data).then(
      (res: any) => {
        addToResult(key, { data: res });
      },
      (err: any) => {
        addToResult(key, { error: err });
      }
    );
  });

  return result;
};

export const DBGetterGroupedRequest = (
  hainsOAuth: any,
  routes: (keyof typeof getter_routes)[],
  callback: (data: GroupResults) => void
) => groupedRequestBase(hainsOAuth, routes, callback);

export const groupedRequest = (
  hainsOAuth: any,
  routes: Routes,
  callback: (data: GroupResults) => void
) => groupedRequestBase(hainsOAuth, routes, callback);
