import Basic from "../../models/basic";
import BasicMethods from "../../models/basic-helper/basicmethods";
import DataGetter from "../../models/basic-helper/datagetter";
import Page from "../../models/basic-helper/page";
import { appModel, clearAppModelFromBasic } from "../mockdata/appmodel";

beforeAll(() => {
  clearAppModelFromBasic();
});

const checkForAppModel = (basic) => {
  expect(basic._appModel).toBe(appModel);
  expect(basic._page).toBe(appModel.page);
  expect(basic._pageData).toBe(appModel.page.data);
  expect(basic._user).toBe(appModel.user);
  expect(basic._hains).toBe(appModel.hains);
}

describe("Whitebox testing", () => {
  describe("User defines Methods and depending Getters", () => {
    const basic = new Basic();
    test(", _page, _appModel, _pageData, _user, _hains", () => {
      // Attribute aus AppModel und AppModel sollten undefined sein
      expect(typeof basic._setAppModel_).toBe("function");
      expect(basic._page).toBeUndefined();
      expect(basic._pageData).toBeUndefined();
      expect(basic._pageData).toBeUndefined();
      expect(basic._user).toBeUndefined();
      expect(basic._hains).toBeUndefined();
      checkForAppModel(new Basic(appModel));
      // Atribute aus AppModel sollten erreichbar sein
      basic._setAppModel_(appModel);
      checkForAppModel(basic);
    });
  
    
    test("set _components_register", () => {
      const a = () => {};
      const b = () => {};
  
      basic._components_register = 3;
      basic._components_register = [];
      basic._components_register = false;
      basic._components_register = {};
      expect(basic._components_register).toEqual({});
      expect(console.log).toHaveBeenCalled();
      basic._components_register = a;
      expect(basic._components_register).toEqual({_default_id_: [a]});
      basic._components_register = a;
      expect(basic._components_register).toEqual({_default_id_: [a]});
      basic._components_register = b;
      expect(basic._components_register).toEqual({_default_id_: [a, b]});
    });
  });
  
  describe("Basics Instances", () => {
    test("basic is Instances (Basic, BasicMethods, Page, DataGetter)", () => {
      const basic = new Basic();
      expect(basic).toBeInstanceOf(Basic);
      expect(basic).toBeInstanceOf(BasicMethods);
      expect(basic).toBeInstanceOf(Page);
      expect(basic).toBeInstanceOf(DataGetter);
    });  
  });
  
  
  describe("Basic sets Properties", () => {
    const basic = new Basic();
    test("sets (" + 
      "_properties_, _Default_id_, _components_register_, _filterVorlagenRegisterKey, " +
      "_me, _properties, _components_register, _is_extensible, _is_frozen"
    + ")", () => {
      expect(Array.isArray(basic._properties_)).toBe(true);
      expect(basic._properties).toBe(basic._properties_);
  
      expect(basic._components_register_).toEqual({});
      expect(basic._components_register).toBe(basic._components_register_);
      
      expect(basic._me).toEqual({});
      expect(basic._is_extensible).toBe(true);
      expect(basic._is_frozen).toBe(false);
      expect(basic._filterVorlagenRegisterKey).toBe("_filterVorlagenRegister_");
      expect(basic._default_id_).toBe("_default_id_");
    });
  });
  
  describe("Basic Setter for _properties and _compoents_register", () => {
    const basic = new Basic();
    test("this._properties = x, pushes Value in this._properties", () => {
      const valuesToIgnore = [10, {}, null, undefined, true, false, [], 10.0, () => {}, function(){}];
      valuesToIgnore.forEach(v => {
        basic._properties = v;
        expect(console.log).toHaveBeenCalled();
        expect(basic._properties_).not.toContain(v);
        expect(basic._properties_).toHaveLength(0);
      });
      
      const value = "test";
      basic._properties = value;
      expect(basic._properties_).toContain(value);
      expect(basic._properties_).toHaveLength(1);
      for(let i = 0; i < 5; i++){
        basic._properties = value;
      }
      expect(basic._properties_).toHaveLength(1);
    });
  
    test("this._components_register = x, pushes Function in this._components_registery[defalut_id]", () => {
      const valuesToIgnore = [10, {}, null, undefined, true, false, [], 10.0, "test"];
      const id = basic._default_id_;
      valuesToIgnore.forEach(v => {
        basic._components_register = v;
        expect(console.log).toHaveBeenCalled();
        expect(basic._components_register).not.toHaveProperty(id);
      });
      
      const legalValues = [function(){}, () => {}];
      legalValues.forEach((fkt, i) => {
        const l = i+1;
        basic._components_register = fkt;
        expect(basic._components_register).toHaveProperty(id);
        const register = basic._components_register[id];
        expect(register).toHaveLength(l);
        expect(register).toContain(fkt);
        for(let i = 0; i < 5; i++){
          basic._components_register = fkt;
        }
        expect(register).toHaveLength(l);
      });
    });
  })
})