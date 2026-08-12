export const state = {
  palette: "rainbow",
  spotPosition: "center",
  spotMove: "circle-floor",
  prism: true,
  bpm: 128,
  masterDimmer: 100,
  blinder: false,
  strobe: false,
};

export function updateState(data) {
  if (data.palette !== undefined) state.palette = String(data.palette);
  if (data.spotPosition !== undefined)
    state.spotPosition = String(data.spotPosition);
  if (data.spotMove !== undefined) state.spotMove = String(data.spotMove);
  if (data.prism !== undefined) state.prism = Boolean(data.prism);
  if (data.bpm !== undefined)
    state.bpm = Math.max(40, Math.min(240, Number(data.bpm)));
  if (data.masterDimmer !== undefined)
    state.masterDimmer = Math.max(0, Math.min(100, Number(data.masterDimmer)));
  if (data.blinder !== undefined) state.blinder = Boolean(data.blinder);
  if (data.strobe !== undefined) state.strobe = Boolean(data.strobe);

  return state;
}
