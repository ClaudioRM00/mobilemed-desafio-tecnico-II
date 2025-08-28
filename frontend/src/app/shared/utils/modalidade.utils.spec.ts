import { getModalidadeLabel, MODALIDADES_LABELS, MODALIDADES_LIST, Modalidade } from './modalidade.utils';

describe('Modalidade Utils', () => {
  beforeEach(() => {
    // Remove console.log calls for testing
    spyOn(console, 'log').and.stub();
  });

  describe('MODALIDADES_LABELS', () => {
    it('should have all modalidade labels defined', () => {
      expect(MODALIDADES_LABELS['CR']).toBe('CR - Radiografia Computadorizada');
      expect(MODALIDADES_LABELS['CT']).toBe('CT - Tomografia Computadorizada');
      expect(MODALIDADES_LABELS['DX']).toBe('DX - Radiografia Digital');
      expect(MODALIDADES_LABELS['MG']).toBe('MG - Mamografia');
      expect(MODALIDADES_LABELS['MR']).toBe('MR - Ressonância Magnética');
      expect(MODALIDADES_LABELS['NM']).toBe('NM - Medicina Nuclear');
      expect(MODALIDADES_LABELS['OT']).toBe('OT - Outros');
      expect(MODALIDADES_LABELS['PT']).toBe('PT - Tomografia por Emissão');
      expect(MODALIDADES_LABELS['RF']).toBe('RF - Fluoroscopia');
      expect(MODALIDADES_LABELS['US']).toBe('US - Ultrassonografia');
      expect(MODALIDADES_LABELS['XA']).toBe('XA - Angiografia');
    });

    it('should have correct number of modalidades', () => {
      const modalidadesCount = Object.keys(MODALIDADES_LABELS).length;
      expect(modalidadesCount).toBe(11);
    });
  });

  describe('MODALIDADES_LIST', () => {
    it('should contain all modalidades', () => {
      expect(MODALIDADES_LIST).toContain('CR');
      expect(MODALIDADES_LIST).toContain('CT');
      expect(MODALIDADES_LIST).toContain('DX');
      expect(MODALIDADES_LIST).toContain('MG');
      expect(MODALIDADES_LIST).toContain('MR');
      expect(MODALIDADES_LIST).toContain('NM');
      expect(MODALIDADES_LIST).toContain('OT');
      expect(MODALIDADES_LIST).toContain('PT');
      expect(MODALIDADES_LIST).toContain('RF');
      expect(MODALIDADES_LIST).toContain('US');
      expect(MODALIDADES_LIST).toContain('XA');
    });

    it('should have correct length', () => {
      expect(MODALIDADES_LIST.length).toBe(11);
    });

    it('should be an array of Modalidade type', () => {
      MODALIDADES_LIST.forEach(modalidade => {
        expect(typeof modalidade).toBe('string');
        expect(MODALIDADES_LABELS[modalidade]).toBeDefined();
      });
    });
  });

  describe('getModalidadeLabel', () => {
    it('should return correct label for valid modalidade', () => {
      const result = getModalidadeLabel('MR');
      expect(result).toBe('MR - Ressonância Magnética');
    });

    it('should return correct label for CT modalidade', () => {
      const result = getModalidadeLabel('CT');
      expect(result).toBe('CT - Tomografia Computadorizada');
    });

    it('should return correct label for US modalidade', () => {
      const result = getModalidadeLabel('US');
      expect(result).toBe('US - Ultrassonografia');
    });

    it('should return original string for invalid modalidade', () => {
      const result = getModalidadeLabel('INVALID');
      expect(result).toBe('INVALID');
    });

    it('should return original string for empty string', () => {
      const result = getModalidadeLabel('');
      expect(result).toBe('');
    });

    it('should handle case sensitivity', () => {
      const result = getModalidadeLabel('mr');
      expect(result).toBe('mr');
    });

    it('should log the input and result', () => {
      getModalidadeLabel('MR');
      
      expect(console.log).toHaveBeenCalledWith('getModalidadeLabel utility called with:', 'MR');
      expect(console.log).toHaveBeenCalledWith('MODALIDADES_LABELS:', MODALIDADES_LABELS);
      expect(console.log).toHaveBeenCalledWith('getModalidadeLabel utility result:', 'MR - Ressonância Magnética');
    });

    it('should log for invalid modalidade', () => {
      getModalidadeLabel('INVALID');
      
      expect(console.log).toHaveBeenCalledWith('getModalidadeLabel utility called with:', 'INVALID');
      expect(console.log).toHaveBeenCalledWith('MODALIDADES_LABELS:', MODALIDADES_LABELS);
      expect(console.log).toHaveBeenCalledWith('getModalidadeLabel utility result:', 'INVALID');
    });
  });
});
