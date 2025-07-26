import type { Table } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { TableHeaderCell } from '@/components/ui';

interface ServerTableBodyProps {
    table: Table<any>;
}

export function ServerTableBody({ table }: ServerTableBodyProps) {
    return (
        <div className='overflow-x-auto'>
            <table className='w-full'>
                <thead>
                    {table.getHeaderGroups().map((headerGroup: any) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header: any) => (
                                <TableHeaderCell key={header.id} header={header} />
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row: any, idx: number, arr: any[]) => (
                        <tr key={row.id} className={`bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer`}>
                            {row.getVisibleCells().map((cell: any) => (
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
