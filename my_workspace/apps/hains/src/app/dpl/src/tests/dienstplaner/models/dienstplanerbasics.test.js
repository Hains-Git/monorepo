import Basic from "../../../models/basic";
import DataGetter from "../../../models/basic-helper/datagetter";
import Page from "../../../models/basic-helper/page";
import { createAppModel } from "../../mockdata/appmodel";

describe("Whitebox testing", () => {
  describe("Instance", () => {
    test("Page is instanceof Page and DataGetter", () => {
      const page = new Page();
      expect(page).toBeInstanceOf(Page);
      expect(page).toBeInstanceOf(DataGetter);
    });  
  });
});
