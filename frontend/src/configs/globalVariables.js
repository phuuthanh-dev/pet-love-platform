// const BASE_URL = "http://localhost:3000/api/v1";
// const BASE_URL = "http://api.petlove.io.vn/api/v1";
const buildMode = import.meta.env.VITE_BUILD_MODE || 'unknown';
console.log('Build mode:', buildMode);
// const FE_URL = "http://localhost:5173";
// const BASE_WS = "http://localhost:3000";

let BASE_URL = import.meta.env.VITE_BUILD_MODE
let FE_URL = import.meta.env.VITE_FE_URL
let BASE_WS = import.meta.env.VITE_BASE_WS

export { BASE_URL, BASE_WS, FE_URL };
