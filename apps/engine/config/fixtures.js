import D1024 from "node-d1024";
const { SharkSpotOne, CompactPar7Tri, StageBlinder2 } = D1024.fixtures;

export const PAR_ADDRESSES = [57, 65, 73, 81, 89, 97, 105, 113, 121, 129, 137];
export const NO_GREEN_ADDRESSES = [65, 73, 89, 105, 113, 121];
export const NO_RED_ADDRESSES = [97];

export function initFixtures(dmx) {
  const pars = PAR_ADDRESSES.map((addr, idx) => {
    return dmx.addFixture(`par_${idx + 1}`, new CompactPar7Tri(addr));
  });

  const spots = {
    frontRight: dmx.addFixture("spot_fr", new SharkSpotOne(1)),
    rearRight: dmx.addFixture("spot_rr", new SharkSpotOne(15)),
    rearLeft: dmx.addFixture("spot_rl", new SharkSpotOne(29)),
    frontLeft: dmx.addFixture("spot_fl", new SharkSpotOne(43)),
  };

  const blinders = [
    dmx.addFixture("blinder_1", new StageBlinder2(510)),
    dmx.addFixture("blinder_2", new StageBlinder2(511)),
  ];

  return { pars, spots, blinders };
}
