export type TableEinteilung = {
  arbeitsplatz?: {
    id: number;
    name: string;
  };
  po_dienst: {
    id: number;
    planname: string;
    color: string;
  };
  bereich?: {
    id: number;
    name: string;
  };
  mitarbeiter: {
    id: number;
    planname: string;
  };
  einteilungsstatus: {
    id: number;
    name: string;
  };
  einteilungskontext: {
    id: number;
    name: string;
  };
  dienstplan: {
    id: number;
    name: string;
  };
  id: number;
  mitarbeiter_id: number;
  po_dienst_id: number;
  tag: string;
};
