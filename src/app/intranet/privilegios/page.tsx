"use client";
import Principal from "@/components/ComponentsIntranet/principal";
const Dashboard = () => {


  return (
    <div className="w-full flex flex-col justify-between gap-2 text-black items-center overflow-auto mx-auto  bg-white dark:bg-gray-900 dark:text-white" >
      <Principal />
    </div>
  );
};

export default Dashboard;
