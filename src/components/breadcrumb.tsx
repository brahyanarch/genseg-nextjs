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
    <Breadcrumb>
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
                          <a
                            href={dropdownItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {dropdownItem.label}
                          </a>
                        ) : (
                          <a href={dropdownItem.href}>{dropdownItem.label}</a>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {item.type === "page" && <BreadcrumbPage>{item.label}</BreadcrumbPage>}
            </BreadcrumbItem>
            {/* Renderiza un separador excepto después del último elemento */}
            {index < items.length - 1 && (
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
