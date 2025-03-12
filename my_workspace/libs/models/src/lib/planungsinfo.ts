import { _planungsinfo } from '@my-workspace/prisma_cruds';

type TMutation = {
  tag: Date;
  po_dienst_id: number;
  bereich_id: number;
  kommentar: string;
};

export async function planungsInfoCreateOrupdate(params: TMutation) {
  return await _planungsinfo.createOrUpdatePlanungsinfo(params);
}

export async function planungsInfoGetAll(anfang: string | Date, ende: string | Date) {
  return await _planungsinfo.getAllPlanungsinfo(anfang, ende);
}
