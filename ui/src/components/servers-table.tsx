import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { Pagination } from '@/components/ui/pagination';
import { ServerTableFilter } from '@/components/ui/server-table-filter';
import type { Server } from '@backend/database/schema';
import { columns } from '@/components/ui/table-columns';
import { TableHeaderCell, TableEmptyState } from '@/components/ui';

interface ServerTableProps {
    servers: Server[];
}

export function ServerTable({ servers }: ServerTableProps) {
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState([{ id: 'players', desc: true }]);
    const [filter, setFilter] = useState('');
    const pageSize = 15;

    const filteredServers = useMemo(() => {
        if (!filter.trim()) return servers;
        return servers.filter((s) => s.name?.toLowerCase().includes(filter.trim().toLowerCase()));
    }, [servers, filter]);

    const sortingTable = useReactTable({
        data: filteredServers,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: false,
        initialState: {
            sorting: [
                {
                    id: 'players',
                    desc: true,
                },
            ],
        },
    });

    const sortedServers = sortingTable.getSortedRowModel().rows.map((row) => row.original);
    const totalPages = Math.max(1, Math.ceil(sortedServers.length / pageSize));

    const paginatedServers = useMemo(() => {
        const start = (page - 1) * pageSize;
        return sortedServers.slice(start, start + pageSize);
    }, [sortedServers, page]);

    const table = useReactTable({
        data: paginatedServers,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: false,
        initialState: {
            sorting: [
                {
                    id: 'players',
                    desc: true,
                },
            ],
        },
    });

    if (page > totalPages) setPage(1);

    return (
        <div className='bg-gray-900 rounded-lg border border-gray-800 overflow-hidden'>
            <ServerTableFilter
                value={filter}
                onChange={(val) => {
                    setFilter(val);
                    setPage(1);
                }}
            />
            <div className='overflow-x-auto'>
                <table className='w-full'>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHeaderCell key={header.id} header={header} />
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row, idx, arr) => (
                            <tr key={row.id} className={`bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer`}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className={`px-6 py-4 whitespace-nowrap${idx < arr.length - 1 ? ' border-b border-gray-800' : ''}`}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination page={page} totalPages={totalPages} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => Math.min(totalPages, p + 1))} />

            {servers.length === 0 && <TableEmptyState message='No servers found' />}
        </div>
    );
}
