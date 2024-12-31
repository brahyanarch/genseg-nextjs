// config/apiConfig.ts
export const API_URL = "https://2nlfx0w1-3000.brs.devtunnels.ms";
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
export const API_DETALLE_PERMISOS = `${API_URL}/api/de_permisos`;
export const API_SUBUNIDADES = `${API_URL}/api/subunidad`;
export const API_LOGIN = `${API_URL}/api/auth/login`;
export const API_LOGIN_UNIQUE = `${API_URL}/api/auth/login/unique`;
export const API_PERMISOS = `${API_URL}/api/permisos`;
export const API_USERS = `${API_URL}/api/auth/user`;
export const API_FORM = `${API_URL}/api/project/form`;
export const API_GET_FORM_BY_SUBUNI = `${API_URL}/api/form`;
export const API_ACTIVITIES = `${API_URL}/api/actividad`;
export const API_PROJECTS = `${API_URL}/api/project`;
export const API_PROJECTS_GRAFICOS = `${API_URL}/api/project/graficos`;
export const API_PROJECTS_DONA = `${API_URL}/api/project/dona`;
export const API_GET_PROJECTS = `${API_URL}/api/project/user`;
export const API_PROJECT_ACTIVITIES = `${API_URL}/api/project`;
export const API_PROJECTS_SUBUNIDAD = `${API_URL}/api/project`;
export const API_ESCUELA_PROFESIONAL = `${API_URL}/api/programaestudio`;
//rutas admin general
export const API_ADMIN = `${API_URL}/auth/login`;
//rutas edicion de formulario
export const API_PREGUNTAS = `${API_URL}/api/Pregunta`;
export const API_RESPUESTAS = `${API_URL}/api/Respuesta`;
/*
//rutas tipos pregunta
export const API_OPC_DES = `${API_URL}/api/OpcionDes`;
export const API_OPC_MUL = `${API_URL}/api/OpcionMul`;
export const API_OPC_UNI = `${API_URL}/api/OpcionUni`;
//rutas tipos respuesta
export const API_RES_OPC_DES = `${API_URL}/api/ResOpcDes`;
export const API_RES_OPC_MUL = `${API_URL}/api/ResOpcMul`;
export const API_RES_OPC_UNI = `${API_URL}/api/ResOpcUni`;
export const API_RES_FECHA = `${API_URL}/api/ResDate`;
export const API_RES_ARCHIVO = `${API_URL}/api/ResFile`;
export const API_RES_TEXTO = `${API_URL}/api/ResOpcText`;*/
//https://2nlfx0w1-3000.brs.devtunnels.mshttps//2nlfx0w1-3000.brs.devtunnels.ms/api/roles/75548237
//https://2nlfx0w1-3000.brs.devtunnels.ms/api/roles/75548237