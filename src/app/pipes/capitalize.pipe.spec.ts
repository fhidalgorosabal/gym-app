import { CapitalizePipe } from './capitalize.pipe';

describe('CapitalizePipe', () => {
  const pipe = new CapitalizePipe();

  it('capitaliza la primera letra', () => {
    expect(pipe.transform('barbell curl')).toBe('Barbell curl');
  });

  it('no altera mayúsculas internas ya intencionadas', () => {
    expect(pipe.transform('v-up con banda')).toBe('V-up con banda');
    expect(pipe.transform('press JM con barra')).toBe('Press JM con barra');
  });

  it('respeta acentos y caracteres especiales', () => {
    expect(pipe.transform('élevation')).toBe('Élevation');
  });

  it('devuelve cadena vacía para null/undefined/vacío', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });

  it('maneja cadenas de un solo carácter', () => {
    expect(pipe.transform('a')).toBe('A');
  });
});
