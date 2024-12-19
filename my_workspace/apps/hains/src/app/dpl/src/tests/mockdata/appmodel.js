import Basic from "../../models/basic";

export const appModel = {
  hains: {},
  user: {},
  data: {},
  tooltip: {},
  page: {
    data: {}
  }
}

export const clearAppModelFromBasic = () => {
  if(Basic._appModel_ !== undefined) {
    delete Basic._appModel_;
  } 
}
export const createAppModel = ({
  hains = {},
  user = {},
  data = {},
  tooltip = {},
  page = {}
}) => {
  clearAppModelFromBasic();
  return {
    hains,
    user,
    data,
    tooltip,
    page
  }
}

export const basicEachMock = (data, callback, except = ["_each"]) => {
  for(const key in data) {
    if (except?.includes(key)) continue;
    callback(data[key], key);
  }
}
