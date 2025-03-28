// const BASE_URL = "http://localhost:3000/api/v1";
// const BASE_URL = "http://api.petlove.io.vn/api/v1";
const buildMode = import.meta.env.VITE_BUILD_MODE || "unknown";
console.log("Build mode:", buildMode);
// const FE_URL = "http://localhost:5173";
// const BASE_WS = "http://localhost:3000";

let BASE_URL = "";
let FE_URL = "";
let BASE_WS = "";

if (buildMode === "development") {
  BASE_URL = "http://localhost:3000/api/v1";
  FE_URL = "http://localhost:5173";
  BASE_WS = "http://localhost:3000";
}

if (buildMode === "production") {
  // BASE_URL = 'https://api.petlove.io.vn/api/v1'
  // FE_URL = 'https://petlove.io.vn'
  // BASE_WS = 'https://api.petlove.io.vn'
  BASE_URL = "http://localhost:3000/api/v1";
  FE_URL = "http://localhost:5173";
  BASE_WS = "http://localhost:3000";
}

export { BASE_URL, BASE_WS, FE_URL };
