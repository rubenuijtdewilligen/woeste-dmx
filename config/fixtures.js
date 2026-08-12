import D1024 from "node-d1024";
const { SharkSpotOne, CompactPar7Tri, StageBlinder2 } = D1024.fixtures;

export function initFixtures(dmx) {
  const parAddresses = [57, 65, 81, 97, 113, 129, 137, 145, 153, 161, 169, 177];

  const pars = parAddresses.map((addr, idx) => {
    return dmx.addFixture(`par_${idx + 1}`, new CompactPar7Tri(addr));
  });

  const spots = {
    frontRight: dmx.addFixture("spot_fr", new SharkSpotOne(1)),
    rearRight: dmx.addFixture("spot_rr", new SharkSpotOne(15)),
    rearLeft: dmx.addFixture("spot_rl", new SharkSpotOne(29)),
    frontLeft: dmx.addFixture("spot_fl", new SharkSpotOne(43)),
  };

  const blinders = [
    dmx.addFixture("blinder_1", new StageBlinder2(511)),
    dmx.addFixture("blinder_2", new StageBlinder2(512)),
  ];

  return { pars, spots, blinders };
}
