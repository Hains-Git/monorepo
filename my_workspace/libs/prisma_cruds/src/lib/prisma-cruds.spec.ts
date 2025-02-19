import { prismaCruds } from './prisma-cruds';

describe('prismaCruds', () => {
  it('should work', () => {
    expect(prismaCruds()).toEqual('prisma_cruds');
  });
});
