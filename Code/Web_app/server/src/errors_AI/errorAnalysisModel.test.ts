import { loadModel, runModel } from "./errorAnalysisModel";
import correctMovementData from "./mocks/puntaEnLineaDerecha.json";

describe("errorAnalysisModel", () => {
  test("should return void when passed the correct move", async () => {
    const errorsModel = await loadModel();
    const modelResult = await runModel(errorsModel, correctMovementData);
    expect(modelResult).toBe(undefined);
  });
  // test("should return an object when passed the incorrect move", async () => {
  //   const errorsModel = await loadModel();
  //   // swap for incorrectMovementData
  //   const modelResult = await runModel(errorsModel, correctMovementData);
  //   expect(modelResult).not.toBe(undefined);
  // });
});
