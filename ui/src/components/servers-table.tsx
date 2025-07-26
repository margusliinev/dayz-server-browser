import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import type { Server } from '@backend/database/schema';
import { columns } from '@/lib/table-columns';

interface ServersTableProps {
    servers: Server[];
}

export function ServersTable({ servers }: ServersTableProps) {
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
                                    <th key={header.id} className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gray-800/50'>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
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

            {servers.length === 0 && (
                <div className='text-center py-12'>
                    <div className='text-4xl mb-4'>🔍</div>
                    <h3 className='text-lg font-medium text-foreground mb-2'>No servers found</h3>
                    <p className='text-gray-400'>Check back later for available servers.</p>
                </div>
            )}
        </div>
    );
}
