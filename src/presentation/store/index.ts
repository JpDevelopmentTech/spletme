// Re-export del store para que presentation/ no importe directamente de src/store/
export { store } from "../../store/store";
export type { RootState } from "../../store/store";
export { setAuth } from "../../store/states/authSlice";
