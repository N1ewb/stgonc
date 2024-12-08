import axios from "axios";

const isLocalhost = window.location.hostname === "localhost";

export const api = axios.create({
  baseURL: isLocalhost ? "http://localhost:5002" : "https://stgonc.vercel.app",
  headers: {
    "Access-Control-Allow-Origin": "*", 
  },
});
