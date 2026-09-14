export const spotBases = {
  frontLeft: { basePan: 270, baseTilt: 135, invertPan: false },
  frontRight: { basePan: 270, baseTilt: 135, invertPan: true },
  rearLeft: { basePan: 90, baseTilt: 135, invertPan: false },
  rearRight: { basePan: 90, baseTilt: 135, invertPan: true },
};

export const staticPositions = {};

staticPositions["center"] = {
  frontLeft: { pan: 320, tilt: 195 },
  frontRight: { pan: 220, tilt: 70 },
  rearLeft: { pan: 75, tilt: 185 },
  rearRight: { pan: 110, tilt: 95 },
};

staticPositions["logo"] = {
  frontLeft: { pan: 351, tilt: 250 },
  frontRight: { pan: 201, tilt: 8 },
  rearLeft: { pan: 150, tilt: 240 },
  rearRight: { pan: 40, tilt: 20 },
};

staticPositions["bar_spotlight"] = {
  frontLeft: { pan: 193, tilt: 235 },
  frontRight: { pan: 329, tilt: 30 },
  rearLeft: { pan: 188, tilt: 25 },
  rearRight: { pan: 160, tilt: 30 },
};

staticPositions["richting_bar"] = {
  frontLeft: { pan: 183, tilt: 225 },
  frontRight: { pan: 349, tilt: 40 },
  rearLeft: { pan: 183, tilt: 50 },
  rearRight: { pan: 175, tilt: 55 },
};

staticPositions["richting_deur"] = {
  frontLeft: { pan: 218, tilt: 250 },
  frontRight: { pan: 369, tilt: 20 },
  rearLeft: { pan: 208, tilt: 20 },
  rearRight: { pan: 189, tilt: 25 },
};

staticPositions["recht_naar_beneden"] = {
  frontLeft: { pan: 390, tilt: 140 },
  frontRight: { pan: 425, tilt: 130 },
  rearLeft: { pan: 540, tilt: 140 },
  rearRight: { pan: 455, tilt: 135 },
};

export function calculateSpotPanTilt(key, spotMove, spotPosition, moveStep) {
  const base = spotBases[key];
  let targetPan = base.basePan;
  let targetTilt = base.baseTilt;

  if (spotMove !== "none") {
    const radius = 200;
    const invert = base.invertPan ? -1 : 1;

    switch (spotMove) {
      case "circle-floor":
        targetPan += Math.cos(moveStep) * radius * invert;
        targetTilt += Math.sin(moveStep) * (radius * 0.5);
        break;
    }
  } else {
    const pos = staticPositions[spotPosition] || staticPositions["center"];

    if (pos[key] && pos[key].pan !== undefined && pos[key].tilt !== undefined) {
      targetPan = pos[key].pan;
      targetTilt = pos[key].tilt;
    } else {
      const panOffset = pos.panOffset !== undefined ? pos.panOffset : 0;
      targetPan = base.basePan + panOffset * (base.invertPan ? -1 : 1);
      targetTilt = pos.tilt !== undefined ? pos.tilt : base.baseTilt;
    }
  }

  return {
    pan: Math.max(0, Math.min(540, targetPan)),
    tilt: Math.max(0, Math.min(270, targetTilt)),
  };
}
