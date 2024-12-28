import React from "react";
import { ChevronDown, Slash } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface items {
  label: string;
  href: string;
  external?: boolean;
}
interface Data {   
  type: string;
  label: string;
  href?: string;
  items?: items[];
}

export function BreadcrumbWithDropdown({ items }:Data) {
  return (
    <Breadcrumb className="text-base font-semibold " >
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {/* Renderiza cada tipo de elemento dinámicamente */}
            <BreadcrumbItem>
              {item.type === "link" && (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
              {item.type === "dropdown" && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    {item.label}
                    <ChevronDown />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.items.map((dropdownItem, i) => (
                      <DropdownMenuItem key={i}>
                        {dropdownItem.external ? (
                          <Link
                            href={dropdownItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {dropdownItem.label}
                          </Link>
                        ) : (
                          <Link href={dropdownItem.href}>{dropdownItem.label}</Link>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {item.type === "page" && <BreadcrumbPage className="text-blue-600 font-semibold" >{item.label}</BreadcrumbPage>}
            </BreadcrumbItem>
            {/* Renderiza un separador excepto después del último elemento */}
            {index < items.length - 1 && (
              <BreadcrumbSeparator>
                <Slash strokeWidth={3} />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
