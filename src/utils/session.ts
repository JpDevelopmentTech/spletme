/**
 * Si hay una sesión iniciada en este navegador.
 *
 * Existe porque la comprobación evidente no funciona: `LocalStorageService`
 * devuelve `{}` cuando la clave no está, y `Boolean({})` es `true`, así que
 * `Boolean(getItem("user"))` da sesión iniciada siempre. Se mira `isAuth`, que
 * es lo que el login escribe y el guard de rutas consulta.
 */
export function isSignedIn(): boolean {
  try {
    return localStorage.getItem("isAuth") === "true";
  } catch {
    return false;
  }
}
