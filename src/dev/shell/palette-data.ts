/*
  Curated AsbirUI palette — GENERATED, not hand-picked.

  22 families (17 chromatic across the full hue wheel + 5 temperature-tinted
  grays) × 11 steps. Every family shares one set of perceptual lightness stops
  (OKLCH L: 97.1%, 93.6%, 88.5%, 80.8%, 71.6%, 64.6%, 56.7%, 49.2%, 42.1%,
  35.2%, 27.4% for 50→950). Per-hue chroma peaks mid-ramp and tapers at the
  ends, then each color is clamped into sRGB gamut. Result: a "500" in any hue
  reads at the same brightness, ramps step evenly to the eye, and the whole
  matrix is coherent by construction — the payoff of generating in OKLCH.

  Regenerate with the OKLCH generator (STEPS/L/CMUL/HUES) if the ramp shape or
  family set changes; these baked hex values are the source the docs page renders.
*/

export const PALETTE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export type PaletteFamily = { name: string; hues: string[] };

export const PALETTE: PaletteFamily[] = [
  { name: "Rose", hues: ["#FFF2F3", "#FFE1E4", "#FFC9CE", "#FFA2AD", "#FF6A85", "#F1436B", "#D02B56", "#AE1D45", "#8C1737", "#6D1029", "#4D061A"] },
  { name: "Pink", hues: ["#FFF1F7", "#FFE0ED", "#FFC6E0", "#FF9CCC", "#FA64B5", "#E14D9F", "#C23786", "#A2296E", "#822058", "#651744", "#470C2E"] },
  { name: "Fuchsia", hues: ["#FDF1FF", "#FBDFFF", "#F7C5FF", "#F19AFF", "#E562FA", "#CD49E2", "#B032C3", "#9324A3", "#761C83", "#5B1466", "#400948"] },
  { name: "Purple", hues: ["#F8F3FF", "#F0E4FF", "#E4CEFF", "#D2ACFF", "#BF80FF", "#B158FF", "#9741DF", "#7D31BB", "#642797", "#4D1D75", "#351053"] },
  { name: "Violet", hues: ["#F5F4FF", "#EAE6FF", "#DAD2FF", "#C3B3FF", "#A88DFF", "#976CFF", "#814FE8", "#6A3EC3", "#55319D", "#41247B", "#2C1657"] },
  { name: "Indigo", hues: ["#F2F5FF", "#E3E9FF", "#CDD7FF", "#ADBCFF", "#879AFF", "#6D7FFF", "#5661EE", "#454EC8", "#363EA2", "#292F7E", "#1A1E5A"] },
  { name: "Blue", hues: ["#F0F6FF", "#DEEBFF", "#C3DBFF", "#9BC2FF", "#68A3FF", "#3E8AFF", "#2371E3", "#175BBF", "#12499A", "#0C3878", "#042555"] },
  { name: "Sky", hues: ["#EBF8FF", "#D3EFFF", "#ADE2FF", "#6BCDFF", "#00B1F0", "#009AD1", "#0081B0", "#006A91", "#005475", "#00415B", "#002C3F"] },
  { name: "Cyan", hues: ["#E3FBFF", "#BEF5FF", "#8BEAFB", "#50D5EA", "#00B8CE", "#00A0B3", "#008696", "#006E7C", "#005863", "#00434D", "#002D34"] },
  { name: "Teal", hues: ["#DAFFF7", "#BCF8ED", "#87EFDE", "#48DBC6", "#00BDA9", "#00A493", "#008A7B", "#007165", "#005A50", "#00463D", "#002F29"] },
  { name: "Emerald", hues: ["#DDFFED", "#BCFBDA", "#88F3C0", "#4ADEA2", "#00C184", "#00A873", "#008C5F", "#00734E", "#005C3D", "#00472E", "#00301E"] },
  { name: "Green", hues: ["#E0FFE5", "#C2FBCC", "#93F3A9", "#60DE83", "#1DC35E", "#00AA4E", "#008F40", "#007533", "#005E28", "#00481D", "#003111"] },
  { name: "Lime", hues: ["#EBFDD5", "#D8F6B5", "#BDEB80", "#9ED545", "#81B800", "#70A000", "#5D8600", "#4B6E00", "#3B5800", "#2D4300", "#1D2E00"] },
  { name: "Yellow", hues: ["#FEF6D3", "#F8EBB2", "#EFDA7A", "#DBC03A", "#BEA200", "#A58D00", "#8A7600", "#716000", "#5B4D00", "#463B00", "#2F2700"] },
  { name: "Amber", hues: ["#FFF4E5", "#FFE6C5", "#FFD092", "#FAAF39", "#DB9200", "#BF7F00", "#A06A00", "#845600", "#6A4500", "#523400", "#382200"] },
  { name: "Orange", hues: ["#FFF3ED", "#FFE3D6", "#FFCDB4", "#FFA87D", "#FF751A", "#E16200", "#BD5200", "#9C4200", "#7E3400", "#622700", "#441800"] },
  { name: "Red", hues: ["#FFF2F0", "#FFE2DE", "#FFCBC4", "#FFA59A", "#FF6F64", "#F83E3A", "#D72527", "#B4161B", "#911214", "#710C0E", "#500405"] },
  { name: "Stone", hues: ["#F7F5F3", "#ECE9E6", "#DDD8D3", "#C5BFB9", "#A8A29B", "#938D86", "#7B756F", "#65605B", "#504D48", "#3E3A37", "#292724"] },
  { name: "Neutral", hues: ["#F5F5F5", "#EAEAEA", "#D9D9D9", "#C0C0C0", "#A3A3A3", "#8E8E8E", "#767676", "#616161", "#4D4D4D", "#3B3B3B", "#272727"] },
  { name: "Zinc", hues: ["#F5F5F6", "#E9E9EB", "#D9D9DC", "#C0C0C4", "#A3A3A7", "#8D8D91", "#76767A", "#616164", "#4D4D50", "#3B3B3D", "#272729"] },
  { name: "Gray", hues: ["#F4F5F7", "#E8EAEC", "#D7D9DD", "#BDC0C5", "#A0A4A8", "#8B8E93", "#74777B", "#5E6165", "#4B4D50", "#393B3E", "#262729"] },
  { name: "Slate", hues: ["#F3F6F8", "#E7EAEF", "#D4DAE1", "#BAC1CA", "#9DA4AD", "#888F98", "#717780", "#5C6169", "#494E54", "#383B40", "#25282B"] },
];
