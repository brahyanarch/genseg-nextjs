
type Permisos = {
  permisos: {
    n_per: string;
  };
  estado: boolean;
};

export const checkPermission = (permissions: Permisos[], permissionName: string) => {
    const permission = permissions.find((perm) => perm.permisos.n_per === permissionName);
    return permission ? permission.estado : false; // Si no existe el permiso, asumimos `false`
};
  