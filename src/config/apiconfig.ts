// config/apiConfig.ts
const API_URL = "https://2nlfx0w1-3000.brs.devtunnels.ms";
//const API_URL = "http://localhost:3000";
/**
 * Función que genera una URL para la API con base en una ruta dinámica y un dni.
 * @param {string} path - La ruta específica que puede incluir el dni en diferentes posiciones.
 * @param {string} dni - El dni del usuario.
 * @returns {string} - La URL completa.
 */
export const apiRolesWithDni = (path: string, dni: string=""): string => {
    return `${path.replace(':dni', dni)}`;
  };
export const apipermisos_id = (path: string, id: number): string => {
  return `${path.replace(':id', id.toString())}`;
};

// Rutas estáticas de ejemplo:
export const API_ROLES_WITH_DNI = `${API_URL}/api/roles/:dni`;  // Corrige el nombre para evitar errores
export const API_PERMISOS_ID = `${API_URL}/api/permisos/:id`;  // Corrige el nombre para evitar errores
export const API_ROLES = `${API_URL}/api/roles`;
export const API_SUBUNIDADES = `${API_URL}/api/subunidad`;
export const API_LOGIN = `${API_URL}/api/auth/login`;
export const API_PERMISOS = `${API_URL}/api/permisos`;

//https://2nlfx0w1-3000.brs.devtunnels.mshttps//2nlfx0w1-3000.brs.devtunnels.ms/api/roles/75548237
//https://2nlfx0w1-3000.brs.devtunnels.ms/api/roles/75548237