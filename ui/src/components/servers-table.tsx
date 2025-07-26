import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import type { Server } from '@backend/database/schema';
import { columns } from '@/lib/table-columns';
import { TableHeaderCell, TableEmptyState } from '@/components/ui';

interface ServerTableProps {
    servers: Server[];
}

export function ServerTable({ servers }: ServerTableProps) {
    const table = useReactTable({
        data: servers,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: {
            sorting: [
                {
                    id: 'players',
                    desc: true,
                },
            ],
        },
    });

    return (
        <div className='bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden'>
            <div className='overflow-x-auto'>
                <table className='w-full'>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className='border-b border-gray-800'>
                                {headerGroup.headers.map((header) => (
                                    <TableHeaderCell key={header.id} header={header} />
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className='divide-y divide-gray-800'>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className='hover:bg-gray-800/30 transition-colors cursor-pointer'>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className='px-6 py-4 whitespace-nowrap'>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {servers.length === 0 && <TableEmptyState message='No servers found' />}
        </div>
    );
}
