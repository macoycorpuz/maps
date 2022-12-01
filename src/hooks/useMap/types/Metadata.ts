export interface MunicipalityMetadata {
  ADM0_EN: string;
  ADM0_PCODE: string;
  ADM1_EN: string;
  ADM1_PCODE: string;
  ADM2_EN: string;
  ADM2_PCODE: string;
  ADM3ALT1EN: string;
  ADM3ALT2EN: string;
  ADM3_EN: string;
  ADM3_PCODE: string;
  ADM3_REF: string;
  Shape_Area: number;
  Shape_Leng: number;
  date: string;
  validOn: string;
  validTo: string;
}

export interface BarangayMetadata {
  Bgy_Code: string;
  Bgy_Name: string;
  Mun_Code: string;
  Mun_Name: string;
  Pro_Code: string;
  Pro_Name: string;
  Reg_Code: string;
  Reg_Name: string;
}
