import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from 'react';
import { Button } from "@/components/ui/button";

interface DynamicTableProps {
  configuration: Array<{
    key: string;
    label: string;
    render: (item: any) => React.ReactNode;
    sortable?: boolean; // Define si la columna es ordenable
  }>;
  data: any[];
  onSort?: (column: string) => void; // Función de ordenamiento
}

const DynamicTable: React.FC<DynamicTableProps> = ({ configuration, data, onSort }) => {
  return (
    <div className="bg-[#E3E6ED] rounded-lg overflow-hidden">
      <Table className="w-[90%] mx-auto my-6">
        <TableHeader>
          <TableRow>
            {configuration.map((col) => (
              <TableHead key={col.key}>
                {col.label}
                {col.sortable && onSort && (
                  <Button 
                    onClick={() => onSort(col.key)} 
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                  >
                    ↕
                  </Button>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="text-gray-900">
          {data.map((item, index) => (
            <TableRow key={index}>
              {configuration.map((col) => (
                <TableCell key={col.key}>{col.render(item)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DynamicTable;
