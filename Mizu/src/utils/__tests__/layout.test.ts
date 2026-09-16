import { describe, expect, it } from 'vitest';
import { tabBarMetrics } from '../layout';

describe('área segura da navegação', () => {
  it.each([0, 16, 24, 34, 48])('mantém o espaço dos botões com inset %i', inset => {
    const style = tabBarMetrics(inset);
    expect(style.paddingBottom).toBeGreaterThanOrEqual(inset + 10);
    expect(style.height - style.paddingBottom).toBe(62);
  });
  it('reserva espaço adicional para fonte ampliada', () => {
    expect(tabBarMetrics(48, 2).height - tabBarMetrics(48, 1).height).toBe(16);
  });
});
