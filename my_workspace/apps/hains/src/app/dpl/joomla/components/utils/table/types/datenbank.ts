export type Schicht = {
  von: string;
  bis: string;
  typ: string;
};

export type Schichten = {
  [key: number]: Schicht[];
};

export type Bedarf = {
  id: number;
  min: number;
  opt: number;
  bereich: {
    name: string;
  };
  arbeitszeitverteilung: {
    name: string;
    arbeitszeit: {
      freizeiten: Schichten;
      schichten: Schichten;
    };
  };
};

export type BedarfPreviewData = {
  id: string;
  planname: string;
  bedarfe: {
    [key: string]: Bedarf[];
  };
};
