import React from "react";
import {  Breadcrumb,  BreadcrumbEllipsis,  BreadcrumbItem,  BreadcrumbLink,  BreadcrumbList,  BreadcrumbPage,  BreadcrumbSeparator,} from "@/components/ui/breadcrumb";

// Definimos el tipo de las propiedades
interface DynamicBreadcrumbProps {
  items: string[];
}

const DynamicBreadcrumb: React.FC<DynamicBreadcrumbProps> = ({ items }) => {
  return (
    <Breadcrumb>
    <BreadcrumbList>
      {items.map((item, index) => (
        <BreadcrumbItem key={index}>
          <BreadcrumbLink
            href=""
            className={
              index === items.length - 1 ? "text-blue-600 font-bold" : ""
            }
          >
            {item}
          </BreadcrumbLink>
          {index < items.length - 1 && <BreadcrumbSeparator />}
        </BreadcrumbItem>
      ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
//<BreadcrumbItems items={["Inicio", "Configuración"]} />