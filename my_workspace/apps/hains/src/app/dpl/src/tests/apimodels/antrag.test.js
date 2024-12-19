import Antrag from "../../models/apimodels/antrag";
import Basic from "../../models/basic";

const antraege = {
  "1": {
      "id": 1,
      "mitarbeiter_id": 1,
      "antragstyp_id": 1,
      "antragsstatus_id": 1,
      "start": "2020-01-01",
      "ende": "2020-01-02",
      "abgesprochen": false,
      "kommentar": null
    }
};

describe("Antrag", () => {
  test("Instance of Antrag and Basic", () => {
    const a = new Antrag(antraege[1]);
    expect(a).toBeInstanceOf(Antrag);
    expect(a).toBeInstanceOf(Basic);
  })
});