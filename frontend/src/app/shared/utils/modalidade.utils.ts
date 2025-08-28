export type Modalidade = 'CR' | 'CT' | 'DX' | 'MG' | 'MR' | 'NM' | 'OT' | 'PT' | 'RF' | 'US' | 'XA';

export const MODALIDADES_LABELS: { [key in Modalidade]: string } = {
  'CR': 'CR - Radiografia Computadorizada',
  'CT': 'CT - Tomografia Computadorizada',
  'DX': 'DX - Radiografia Digital',
  'MG': 'MG - Mamografia',
  'MR': 'MR - Ressonância Magnética',
  'NM': 'NM - Medicina Nuclear',
  'OT': 'OT - Outros',
  'PT': 'PT - Tomografia por Emissão',
  'RF': 'RF - Fluoroscopia',
  'US': 'US - Ultrassonografia',
  'XA': 'XA - Angiografia'
};

export function getModalidadeLabel(modalidade: string): string {
  console.log('getModalidadeLabel utility called with:', modalidade);
  console.log('MODALIDADES_LABELS:', MODALIDADES_LABELS);
  const result = MODALIDADES_LABELS[modalidade as Modalidade] || modalidade;
  console.log('getModalidadeLabel utility result:', result);
  return result;
}

export const MODALIDADES_LIST: Modalidade[] = ['CR', 'CT', 'DX', 'MG', 'MR', 'NM', 'OT', 'PT', 'RF', 'US', 'XA'];
