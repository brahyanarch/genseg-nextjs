"use client";
import Principal from "@/components/ComponentsIntranet/principal";
const Dashboard = () => {

/*
  // Obtener el nombre del rol por su ID
  const getRoleName = (rol_id: number) => {
    const role = roles.find((r) => r.id_rol === rol_id);
    return role ? role.n_rol : `Rol ${rol_id}`;
  };

  // Obtener el nombre de la subunidad por su ID
  const getSubunidadName = (subunidad_id: number) => {
    const subunidad = subunidades.find((s) => s.id_subuni === subunidad_id);
    return subunidad ? subunidad.n_subuni : `Subunidad ${subunidad_id}`;
  };
  const fetchUs = async () => {
    try {
      const response = await fetch(`${API_USERS}/${dni}`);
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setUser(data);
      } else {
        console.error('Respuesta de API no válida:', data);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  // Fetch de roles y subunidades
  useEffect(() => {
    fetchUs();
    const fetchData = async () => {
      try {
        // Fetch roles
        const [rolesResponse, subunidadesResponse] = await Promise.all([
          fetch(API_ROLES),
          fetch(API_SUBUNIDADES),
        ]);

        if (!rolesResponse.ok || !subunidadesResponse.ok) {
          throw new Error("Error fetching data");
        }

        const rolesData: Role[] = await rolesResponse.json();
        const subunidadesData: Subunidad[] = await subunidadesResponse.json();

        setRoles(rolesData);
        setSubunidades(subunidadesData);
      } catch (error) {
        setError("Ocurrió un error al cargar los datos. Por favor, intenta de nuevo.");
        console.error("Error fetching data:", error);
      }
    };
console.log(User);

    //fetchData();
    setIsClient(true);
  }, []);*/

  

  return (
    <div className="w-full flex flex-col justify-between gap-2 text-black items-center overflow-auto mx-auto  bg-white dark:bg-gray-900 dark:text-white" > 
      <Principal/>
    </div>
  );
};

export default Dashboard;
