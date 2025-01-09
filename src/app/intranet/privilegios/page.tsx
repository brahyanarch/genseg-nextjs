"use client";
import PrincipalAdmin from "@/components/ComponentsIntranet/principalAdmin";
const Dashboard = () => {


  return (
    <div className="w-full flex flex-col justify-between gap-2 text-black items-center overflow-auto mx-auto  bg-white dark:bg-gray-900 dark:text-white" >
      <PrincipalAdmin />
    </div>
  );
};

export default Dashboard;
