import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

describe('ilustrações aprovadas', () => {
  const coats = ['white', 'black', 'gray', 'orange', 'siamese'];
  const moods = ['sleeping', 'stretching', 'playing', 'happy', 'celebrating'];
  const folder = resolve('assets/cats/approved');
  it('inclui todas as 25 combinações em PNG sem arquivos vazios', () => {
    expect(readdirSync(folder).filter(name => name.endsWith('.png'))).toHaveLength(25);
    const catalog = readFileSync(resolve('src/data/catArtwork.ts'), 'utf8');
    for (const coat of coats) for (const mood of moods) {
      const file = `${coat}-${mood}.png`;
      const bytes = readFileSync(resolve(folder, file));
      expect(bytes.subarray(1, 4).toString()).toBe('PNG');
      expect(bytes[25]).toBe(6); // PNG RGBA: transparency must survive extraction.
      expect(bytes.readUInt32BE(16)).toBeGreaterThan(150);
      expect(bytes.readUInt32BE(20)).toBeGreaterThan(150);
      expect(catalog).toContain(`require('../../assets/cats/approved/${file}')`);
    }
  });
  it('renderiza a ilustração inteira, sem tintura nem rosto sobreposto', () => {
    const source = readFileSync(resolve('src/components/CatIllustration.tsx'), 'utf8');
    expect(source).toContain('catArtwork[color][mood]');
    expect(source).toContain('resizeMode="contain"');
    expect(source).not.toMatch(/tintColor|<Face|<CoatDetails|<Svg/);
  });
});
