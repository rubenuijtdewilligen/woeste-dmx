import { hsvToRgb } from "./hsv.js";

const colorMap = {
  red: { c1: [255, 0, 0], c2: [255, 0, 0] },
};

export function getParColor(paletteName, idx, totalPars, moveStep, isFlipped) {
  if (paletteName === "rainbow") {
    const hue = (moveStep * 0.15 + idx / totalPars) % 1;
    return hsvToRgb(hue, 1, 1);
  }

  const colors = colorMap[paletteName] || colorMap["red"];
  const colorA = isFlipped ? colors.c2 : colors.c1;
  const colorB = isFlipped ? colors.c1 : colors.c2;

  return idx % 2 === 0 ? colorA : colorB;
}

export function getSpotColorIndices(paletteName, moveStep, isFlipped) {
  let colorIndexA = 0;
  let colorIndexB = 0;

  if (paletteName === "rainbow") {
    const baseIndex = (Math.floor(moveStep * 1.5) % 7) + 1;
    colorIndexA = baseIndex;
    colorIndexB = ((baseIndex + 2) % 7) + 1;
  } else {
    if (paletteName === "red") {
      colorIndexA = 1;
      colorIndexB = 1;
    }
  }

  return {
    finalSpotColorA: isFlipped ? colorIndexB : colorIndexA,
    finalSpotColorB: isFlipped ? colorIndexA : colorIndexB,
  };
}
