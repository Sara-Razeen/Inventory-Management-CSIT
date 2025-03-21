
import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  idField: keyof T;
  searchField?: keyof T;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
}

const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  idField,
  searchField,
  onRowClick,
  actions,
}: DataTableProps<T>) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtering data based on search query
  const filteredData = searchField && searchQuery
    ? data.filter(item => 
        String(item[searchField])
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : data;

  // Pagination
  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[240px]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1); // Reset to first page on search
              }}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Showing {paginatedData.length ? (page - 1) * perPage + 1 : 0}-
            {Math.min(page * perPage, filteredData.length)} of {filteredData.length}
          </span>
          <Select
            value={perPage.toString()}
            onValueChange={(value) => {
              setPerPage(Number(value));
              setPage(1); // Reset to first page on items per page change
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={String(column.accessor)}>{column.header}</th>
              ))}
              {actions && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8">
                  No data found
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr
                  key={String(item[idField])}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={onRowClick ? "cursor-pointer" : ""}
                >
                  {columns.map((column) => (
                    <td key={`${String(item[idField])}-${String(column.accessor)}`}>
                      {column.cell ? column.cell(item) : String(item[column.accessor] || "")}
                    </td>
                  ))}
                  {actions && (
                    <td className="text-right">{actions(item)}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
