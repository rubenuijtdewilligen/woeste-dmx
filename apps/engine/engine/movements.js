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

export function calculateSpotPanTilt(key, spotMove, spotPosition, moveStep) {
  const base = spotBases[key];
  let targetPan = base.basePan;
  let targetTilt = base.baseTilt;

  if (spotMove !== "none") {
    const radius = 35;
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
