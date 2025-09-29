import { mockRides } from "../constants/MockData";

function mockDirectionService() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRides);
    }, 3000);
  });
}


export { mockDirectionService }