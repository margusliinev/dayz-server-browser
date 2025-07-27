import type { Table, Row, HeaderGroup, Header, Cell } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { TableHeaderCell } from '@/components/ui';

interface ServerTableBodyProps<T> {
    table: Table<T>;
    rows?: Row<T>[];
}

export function ServerTableBody<T>({ table, rows }: ServerTableBodyProps<T>) {
    const displayRows = rows || table.getRowModel().rows;

    return (
        <div className='overflow-x-auto'>
            <table className='w-full'>
                <thead>
                    {table.getHeaderGroups().map((headerGroup: HeaderGroup<T>) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header: Header<T, unknown>) => (
                                <TableHeaderCell key={header.id} header={header} />
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {displayRows.map((row: Row<T>, idx: number, arr: Row<T>[]) => (
                        <tr key={row.id} className='bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer'>
                            {row.getVisibleCells().map((cell: Cell<T, unknown>) => (
                                <td key={cell.id} className={`px-6 py-4 whitespace-nowrap${idx < arr.length - 1 ? ' border-b border-gray-800' : ''}`}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
