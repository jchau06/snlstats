import React from 'react';

interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  highlight?: boolean;
}
 
interface TableProps {
  columns: TableColumn[];
  data: Array<Record<string, React.ReactNode>>;
  onSort?: (key: string) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  className?: string;
}
 
export function Table({
  columns,
  data,
  onSort,
  sortBy,
  sortOrder = 'asc',
  className = '',
}: TableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#2C2C2A]">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => {
                  if (col.sortable && onSort) {
                    onSort(col.key);
                  }
                }}
                className={`stat-label py-4 px-4 text-${col.align || 'left'} ${
                  col.sortable ? 'cursor-pointer hover:text-primary' : ''
                } ${sortBy === col.key ? 'text-primary' : ''}`}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable && sortBy === col.key && (
                    <span className="text-xs">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-[#2C2C2A] hover:bg-[#1a1a1a] transition-colors duration-base"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-4 px-4 text-${col.align || 'left'} ${
                    col.highlight
                      ? 'text-primary font-semibold'
                      : 'text-tertiary'
                  }`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
