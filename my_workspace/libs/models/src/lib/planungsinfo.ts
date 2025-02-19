import { createOrUpdatePlanungsinfo, getAllPlanungsinfo } from '@my-workspace/prisma_cruds';

type TMutation = {
  tag: Date;
  po_dienst_id: number;
  bereich_id: number;
  kommentar: string;
};

export async function planungsInfoCreateOrupdate(params: TMutation) {
  return await createOrUpdatePlanungsinfo(params);
}

export async function planungsInfoGetAll(anfang: string, ende: string) {
  return await getAllPlanungsinfo(anfang, ende);
}
