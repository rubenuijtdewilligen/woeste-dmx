import { hsvToRgb } from "./hsv.js";

const colorMap = {
  red: { c1: [255, 0, 0], c2: [255, 0, 0] },
};

const NO_GREEN_ADDRESSES = [65, 73, 89, 105, 113, 121];
const NO_RED_ADDRESSES = [97];

function applyHardwareCorrections(r, g, b, address) {
  if (NO_GREEN_ADDRESSES.includes(address)) {
    const greenCompensate = Math.round(g * 0.5);
    r = Math.min(255, r + greenCompensate);
    b = Math.min(255, b + greenCompensate);
    g = 0;
  }

  if (NO_RED_ADDRESSES.includes(address)) {
    const redCompensate = Math.round(r * 0.5);
    g = Math.min(255, g + redCompensate);
    b = Math.min(255, b + redCompensate);
    r = 0;
  }

  return [r, g, b];
}

export function getParColor(
  paletteName,
  idx,
  parAddresses,
  moveStep,
  isFlipped,
) {
  const address = parAddresses[idx];
  const totalPars = parAddresses.length;
  let r = 0,
    g = 0,
    b = 0;

  if (paletteName === "rainbow") {
    const hue = (moveStep * 0.15 + idx / totalPars) % 1;
    [r, g, b] = hsvToRgb(hue, 1, 1);
  } else {
    const colors = colorMap[paletteName] || colorMap["red"];
    const colorA = isFlipped ? colors.c2 : colors.c1;
    const colorB = isFlipped ? colors.c1 : colors.c2;
    [r, g, b] = idx % 2 === 0 ? colorA : colorB;
  }

  return applyHardwareCorrections(r, g, b, address);
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
