export type Appearance = {
  presetId: string;
  accent: string;
  secondary: string;
  style: 'gradient' | 'solid';
};

export type AppearancePreset = Appearance & { name: string; description: string };
export const themes: AppearancePreset[] = [
  {
    presetId: 'lab-lavender',
    name: 'Lab lavender',
    description: 'The original, softly refreshed',
    accent: '#7862c8',
    secondary: '#c6b9ec',
    style: 'gradient',
  },
  {
    presetId: 'strawberry-milk',
    name: 'Strawberry milk',
    description: 'Rose pink + creamy peach',
    accent: '#d56c97',
    secondary: '#f6c5b9',
    style: 'gradient',
  },
  {
    presetId: 'rose-cloud',
    name: 'Rose cloud',
    description: 'Petal pink + lilac skies',
    accent: '#cf76ac',
    secondary: '#cab6ed',
    style: 'gradient',
  },
  {
    presetId: 'pink-sorbet',
    name: 'Pink sorbet',
    description: 'Raspberry + soft coral',
    accent: '#d74d86',
    secondary: '#f6ab9c',
    style: 'gradient',
  },
  {
    presetId: 'cherry-blossom',
    name: 'Cherry blossom',
    description: 'Blush + warm rose',
    accent: '#be6383',
    secondary: '#f5c7d5',
    style: 'gradient',
  },
  {
    presetId: 'cotton-candy',
    name: 'Cotton candy',
    description: 'Candy pink meets baby blue',
    accent: '#c97bb9',
    secondary: '#a9d3ee',
    style: 'gradient',
  },
  {
    presetId: 'ballet-slipper',
    name: 'Ballet slipper',
    description: 'Muted mauve + powder pink',
    accent: '#b47598',
    secondary: '#ecd4dd',
    style: 'gradient',
  },
  {
    presetId: 'berry-notes',
    name: 'Berry notes',
    description: 'Plum + rosy lilac',
    accent: '#98558f',
    secondary: '#dea5ce',
    style: 'gradient',
  },
  {
    presetId: 'blue-hour',
    name: 'Blue hour',
    description: 'Periwinkle + sky blue',
    accent: '#697dcc',
    secondary: '#a2d8ec',
    style: 'gradient',
  },
  {
    presetId: 'cloud-nine',
    name: 'Cloud nine',
    description: 'Clear blue + cool lavender',
    accent: '#588fc4',
    secondary: '#c7c5ed',
    style: 'gradient',
  },
  {
    presetId: 'blueberry-milk',
    name: 'Blueberry milk',
    description: 'Cornflower + pale violet',
    accent: '#7e85ce',
    secondary: '#d1c5ef',
    style: 'gradient',
  },
  {
    presetId: 'ocean-breeze',
    name: 'Ocean breeze',
    description: 'Soft teal + sea glass',
    accent: '#469ea8',
    secondary: '#b8dfdc',
    style: 'gradient',
  },
  {
    presetId: 'sky-dream',
    name: 'Sky dream',
    description: 'Denim blue + airy cyan',
    accent: '#5c91cb',
    secondary: '#b5e3ef',
    style: 'gradient',
  },
  {
    presetId: 'lavender-haze',
    name: 'Lavender haze',
    description: 'Lilac + peach glow',
    accent: '#9a77c6',
    secondary: '#efc6c3',
    style: 'gradient',
  },
  {
    presetId: 'peach-journal',
    name: 'Peach journal',
    description: 'Apricot + warm pink',
    accent: '#ca866c',
    secondary: '#f0bdd0',
    style: 'gradient',
  },
  {
    presetId: 'matcha-morning',
    name: 'Matcha morning',
    description: 'Sage + vanilla green',
    accent: '#78967a',
    secondary: '#d5dfb5',
    style: 'gradient',
  },
  {
    presetId: 'mint-to-be',
    name: 'Mint to be',
    description: 'Fresh mint + delicate blue',
    accent: '#5c9c91',
    secondary: '#bfd9ee',
    style: 'gradient',
  },
  {
    presetId: 'sunny-side',
    name: 'Sunny side',
    description: 'Honey + pale apricot',
    accent: '#b48b48',
    secondary: '#f1d5b8',
    style: 'gradient',
  },
  {
    presetId: 'sunset-study',
    name: 'Sunset study',
    description: 'Terracotta + golden rose',
    accent: '#b96f75',
    secondary: '#e9b483',
    style: 'gradient',
  },
  {
    presetId: 'moonlit-lilac',
    name: 'Moonlit lilac',
    description: 'Dusky violet + quiet blue',
    accent: '#81709e',
    secondary: '#afc1df',
    style: 'gradient',
  },
];
export const defaultAppearance: Appearance = {
  presetId: themes[0].presetId,
  accent: themes[0].accent,
  secondary: themes[0].secondary,
  style: themes[0].style,
};
const hexPattern = /^#[0-9a-fA-F]{6}$/;
export function isAppearance(value: unknown): value is Appearance {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.presetId === 'string' &&
    v.presetId.length > 0 &&
    v.presetId.length <= 50 &&
    typeof v.accent === 'string' &&
    hexPattern.test(v.accent) &&
    typeof v.secondary === 'string' &&
    hexPattern.test(v.secondary) &&
    (v.style === 'gradient' || v.style === 'solid')
  );
}
function rgb(hex: string) {
  return [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16));
}
export function mixColor(a: string, b: string, fraction: number) {
  const ar = rgb(a),
    br = rgb(b),
    f = Math.min(1, Math.max(0, fraction));
  return (
    '#' +
    ar
      .map((v, i) =>
        Math.round(v + (br[i] - v) * f)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}
function luminance(hex: string) {
  const c = rgb(hex).map((v) => {
    const n = v / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
}
export function contrastRatio(a: string, b: string) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function accessibleAccent(hex: string) {
  let result = hex;
  for (let i = 0; i < 30 && contrastRatio(result, '#ffffff') < 4.7; i++)
    result = mixColor(result, '#17213a', 0.08);
  return result;
}
export function appearanceVariables(value: Appearance, dark = false): Record<string, string> {
  const theme = isAppearance(value) ? value : defaultAppearance;
  const buttonPrimary = accessibleAccent(theme.accent);
  let primary = buttonPrimary;
  if (dark) {
    primary = theme.accent;
    for (let i = 0; i < 30 && contrastRatio(primary, '#222431') < 4.7; i++)
      primary = mixColor(primary, '#ffffff', 0.1);
  }
  const readableHero = (color: string) => {
    let background = color;
    for (let i = 0; i < 30 && contrastRatio(background, '#ada6c4') < 4.6; i++)
      background = mixColor(background, '#171725', 0.1);
    return background;
  };
  const heroStart = readableHero(mixColor(theme.accent, '#202034', 0.66));
  const heroEnd = readableHero(mixColor(theme.secondary, '#202034', 0.72));
  return {
    '--primary': primary,
    '--button-primary': buttonPrimary,
    '--primary-soft': mixColor(theme.accent, dark ? '#222431' : '#ffffff', dark ? 0.78 : 0.9),
    '--dark': heroStart,
    '--bg': mixColor(theme.accent, dark ? '#191b25' : '#ffffff', dark ? 0.96 : 0.974),
    '--green': mixColor(theme.secondary, '#ffffff', 0.72),
    '--appearance-accent': theme.accent,
    '--appearance-secondary': theme.secondary,
    '--app-gradient':
      theme.style === 'gradient' ? `linear-gradient(125deg, ${heroStart}, ${heroEnd})` : heroStart,
    '--appearance-pastel-gradient':
      theme.style === 'gradient'
        ? `linear-gradient(135deg, ${mixColor(theme.accent, '#ffffff', 0.87)}, ${mixColor(theme.secondary, '#ffffff', 0.8)})`
        : mixColor(theme.accent, '#ffffff', 0.88),
  };
}
export function applyAppearance(element: HTMLElement, value: Appearance) {
  for (const [key, color] of Object.entries(
    appearanceVariables(value, element.dataset.theme === 'dark'),
  ))
    element.style.setProperty(key, color);
  element.dataset.appearance = isAppearance(value) ? value.presetId : defaultAppearance.presetId;
}
