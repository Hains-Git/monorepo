import { getFormDataAsObject, getIndexFromPattern, getNestedAttr, nestedFormDataPattern } from '../../helper/util';

describe('utils getNestedAttr', () => {
  const obj = { 
    a: [{2: {b: "Test 1"}}], 
    b: {c: "Test 2"}, 
    d: [
      {e: 'Test 3'},
      {e: 'Test 4'}
    ],
    f: [
      {g: [
        {h: 'Test 5'},
        {h: 'Test 6'}
      ]},
      {g: [
        {h: 'Test 7'},
        {h: 'Test 8'}
      ]}
    ],
    i: {
      ia: {iaa: "Test 9"},
      ib: {iaa:"Test 10"},
      1: {iaa:"Test 11"},
      2: {iaa:"Test 12"}
    }
  };
  [
    {
      key: 'a.0.2.b', value: 'Test 1'
    },
    {
      key: 'b.c', value: 'Test 2'
    },
    {
      key: 'd.@.e', value: 'Test 3\nTest 4'
    },
    {
      key: 'f.@.g.@.h', value: 'Test 5\nTest 6\nTest 7\nTest 8'
    },
    {
      key: 'i.@.iaa', value: 'Test 11\nTest 12\nTest 9\nTest 10'
    }
  ].forEach(({key, value}) => {
    test(`should return ${value} for ${key}`, () => {
      expect(getNestedAttr(obj, key, "\n")).toBe(value);
    });
  });
});

describe('utils nestedPattern', () => {
  [
    {
      key: 'standorte_themen[0].1[0].1', matches: ['[0]', '.1', '[0]', '.1']
    }, 
    {
      key: 'standorte_themen[0].1[eingeteilt_count_factor]', matches: ['[0]', '.1', '[eingeteilt_count_factor]']
    }, 
    {
      key: 'standorte_themen.hallo-test.1[0]', matches: ['.hallo-test', '.1', '[0]']
    }, 
    {
      key: 'standorte_themen[eingeteilt_count_factor][0].1', matches: ['[eingeteilt_count_factor]', '[0]', '.1']
    }
  ].forEach(({key, matches}) => {
    test(`should return ${matches} for ${key}`, () => {
      expect(key.match(nestedFormDataPattern)).toEqual(expect.arrayContaining(matches));
    });
  });
})

describe('utils getIndexFromPattern', () => {
  [
    {
      key: '[0]', index: '0'
    }, {
      key: '.1', index: '1'
    }, {
      key: '[hallo]', index: 'hallo'
    }, {
      key: '.test-hi', index: 'test-hi'
    }
  ].forEach(({key, index}) => {
    test(`should return ${index} for ${key}`, () => {
      expect(getIndexFromPattern(key)).toBe(index.toString());
    });
  });
});

describe('utils getFormDataAsObject', () => {
  const formData = new FormData();
  formData.append('standorte_themen[0].1[0].1', 'test');
  formData.append('standorte_themen[0].1[1].2', 'test');
  formData.append('standorte_themen[0].1[2].1', 'test');
  formData.append('standorte_themen[1].2[0]', 'test');
  formData.append('standorte_themen[1].2[1]', 'test');
  formData.append('hallo-test.1[0]', 'test');
  formData.append('hallo-test.1[1]', 'test');
  formData.append('hallo-test[eingeteilt_count_factor][0].1', 'test');
  formData.append('hallo-test[eingeteilt_count_factor][1].1', 'test');
  formData.append('a[0][a]', 'test');
  formData.append('a[0][b]', 'test');
  formData.append('a[1][b]', 'test');
  formData.append('a[1][v]', 'test');
  const obj = {
    standorte_themen: JSON.stringify([
      {
        1: [
          { 1: 'test' },
          { 2: 'test' },
          { 1: 'test' }
        ]
      },
      {
        2: [
          'test',
          'test'
        ]
      }
    ]),
    'hallo-test': JSON.stringify({
      1: ['test', 'test'],
      eingeteilt_count_factor: [
        {
          1: 'test'
        },
        {
          1: 'test'
        }
      ]
    }),
    a: JSON.stringify([
      { a: 'test', b: 'test' },
      { b: 'test', v: 'test' }
    ])
  };
  test('should return object', () => {
    expect(getFormDataAsObject(formData)).toEqual(obj);
  });
});