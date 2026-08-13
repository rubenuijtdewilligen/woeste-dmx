export const spotBases = {
  frontLeft: { basePan: 270, baseTilt: 135, invertPan: false },
  frontRight: { basePan: 270, baseTilt: 135, invertPan: true },
  rearLeft: { basePan: 90, baseTilt: 135, invertPan: false },
  rearRight: { basePan: 90, baseTilt: 135, invertPan: true },
};

export const staticPositions = {
  center: { panOffset: 0, tilt: 135 },
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
    targetPan += pos.panOffset * (base.invertPan ? -1 : 1);
    targetTilt = pos.tilt;
  }

  return {
    pan: Math.max(0, Math.min(540, targetPan)),
    tilt: Math.max(0, Math.min(270, targetTilt)),
  };
}
