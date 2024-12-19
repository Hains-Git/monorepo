import { getNextVonBis, sortVertragsPhasenOrArbeitszeitenByVonBisId, getPrevVonAndNextBis, getNanDiff} from '../../helper/vertrags_zeitraum';
import { sortedPhasen, editPhasen } from './vertrags_zeitraum_data';

describe('vertrags_zeitraum getNanDiff', () => {
  test("a is NaN", () => {
    expect(getNanDiff(NaN, 1)).toBe(1);
  });
  test("b is NaN", () => {
    expect(getNanDiff(1, NaN)).toBe(-1);
  });
  test("a and b are NaN", () => {
    expect(getNanDiff(NaN, NaN)).toBe(0);
  });
  test("a and b are not NaN", () => {
    expect(getNanDiff(1, 2)).toBe(-1);
    expect(getNanDiff(2, 1)).toBe(1);
  });
});

describe('vertrags_zeitraum sortVertragsPhasenOrArbeitszeitenByVonBisId', () => {
  test("Sort phasen by von, bis and id", () => {
    const randomPhasen = [...sortedPhasen].sort(() => Math.random() - 0.5);
    randomPhasen.sort(sortVertragsPhasenOrArbeitszeitenByVonBisId);
    randomPhasen.forEach((phase, index) => {
      expect(phase.id).toBe(index + 1);
    });
  });
});

describe('vertrags_zeitraum getNextVonBis', () => {
  const phasen = [...sortedPhasen];
  test('key = von', () => {
    const length = phasen.length;
    const substractOneDay = getNextVonBis(1, phasen, "von");
    expect(substractOneDay).toBe("2020-02-02");
    const outside = getNextVonBis(-1, phasen, "von");
    expect(outside).toBe("");
    const noDate = getNextVonBis(7, phasen, "von");
    expect(noDate).toBe("");
    const outside1 = getNextVonBis(length, phasen, "von");
    expect(outside1).toBe("");
    const nextAvailableDate = getNextVonBis(0, [phasen[7], phasen[4]], "von");
    expect(nextAvailableDate).toBe("2022-12-04");
  });
  test('key = bis', () => {
    const length = phasen.length;
    const addOneDay = getNextVonBis(1, phasen, "bis");
    expect(addOneDay).toBe("2023-04-01");
    const outside = getNextVonBis(length, phasen, "bis");
    expect(outside).toBe("");
    const previousAvailableDate = getNextVonBis(7, phasen, "bis");
    expect(previousAvailableDate).toBe("2022-12-01");
    const outside1 = getNextVonBis(-1, phasen, "bis");
    expect(outside1).toBe("");
    const noDate = getNextVonBis(1, phasen.slice(7), "bis");
    expect(noDate).toBe("");
  });
});

describe('vertrags_zeitraum getPrevVonAndNextBis', () => {
  const phasen = [...editPhasen];
  const [overflowAnfang, overflowEnde] = [
    "2030-01-01",
    "2030-04-01"
  ];
  const [vertragAnfang, vertragEnde] = [
    "2020-02-03",
    "2025-01-31"
  ];
  const [underflowAnfang, underFlowEnde] = [
    "2018-02-03",
    "2019-02-03"
  ]
  test("Edit first phase", () => {
    const underflowAfter = getPrevVonAndNextBis(phasen, 1, underflowAnfang, underFlowEnde);
    expect(underflowAfter[0]).toBe("");
    expect(underflowAfter[1]).toBe(underFlowEnde);
    const nextVonMinusOne = "2021-01-31";
    const overflowAfter = getPrevVonAndNextBis(phasen, 1, overflowAnfang, overflowEnde);
    expect(overflowAfter[0]).toBe("");
    expect(overflowAfter[1]).toBe(nextVonMinusOne);
    const edit = getPrevVonAndNextBis(phasen, 1, vertragAnfang, vertragEnde);
    expect(edit[0]).toBe("");
    expect(edit[1]).toBe(nextVonMinusOne);
  });
  test("Edit last phase", () => {
    const previousBisPlusOne = "2023-01-01";
    const underflow = getPrevVonAndNextBis(phasen, 3, underflowAnfang, underFlowEnde);
    expect(underflow[0]).toBe(previousBisPlusOne);
    expect(underflow[1]).toBe("");
    const overflow = getPrevVonAndNextBis(phasen, 3, overflowAnfang, overflowEnde);
    expect(overflow[0]).toBe(overflowAnfang);
    expect(overflow[1]).toBe("");
    const edit = getPrevVonAndNextBis(phasen, 3, vertragAnfang, vertragEnde);
    expect(edit[0]).toBe(previousBisPlusOne);
    expect(edit[1]).toBe("");
  });
  test("Edit middle phase", () => {
    const previousBisPlusOne = "2021-02-01";
    const nextVonMinusOne = "2022-12-31";
    const underflow = getPrevVonAndNextBis(phasen, 2, underflowAnfang, underFlowEnde);
    expect(underflow[0]).toBe(previousBisPlusOne);
    expect(underflow[1]).toBe(underFlowEnde);
    const overflow = getPrevVonAndNextBis(phasen, 2, overflowAnfang, overflowEnde);
    expect(overflow[0]).toBe(overflowAnfang);
    expect(overflow[1]).toBe(nextVonMinusOne);
    const edit = getPrevVonAndNextBis(phasen, 2, vertragAnfang, vertragEnde);
    expect(edit[0]).toBe(previousBisPlusOne);
    expect(edit[1]).toBe(nextVonMinusOne);
  });
});