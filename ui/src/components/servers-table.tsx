import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { Pagination } from '@/components/ui/pagination';
import { ServerTableFilter } from '@/components/ui/server-table-filter';
import type { Server } from '@backend/database/schema';
import { columns } from '@/components/ui/table-columns';
import { TableEmptyState, ServerTableBody } from '@/components/ui';

interface ServerTableProps {
    servers: Server[];
}

export function ServerTable({ servers }: ServerTableProps) {
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState([{ id: 'players', desc: true }]);
    const [filter, setFilter] = useState('');
    const [minPlayers, setMinPlayers] = useState<number | ''>('');
    const [maxPlayers, setMaxPlayers] = useState<number | ''>('');
    const pageSize = 15;

    const filteredServers = useMemo(() => {
        let result = servers;
        if (filter.trim()) {
            result = result.filter((s) => s.name?.toLowerCase().includes(filter.trim().toLowerCase()));
        }
        if (minPlayers !== '') {
            result = result.filter((s) => (typeof s.players === 'number' ? s.players >= minPlayers : false));
        }
        if (maxPlayers !== '') {
            result = result.filter((s) => (typeof s.players === 'number' ? s.players <= maxPlayers : false));
        }
        return result;
    }, [servers, filter, minPlayers, maxPlayers]);

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
                minPlayers={minPlayers}
                maxPlayers={maxPlayers}
                onMinPlayersChange={(val) => {
                    setMinPlayers(val);
                    setPage(1);
                }}
                onMaxPlayersChange={(val) => {
                    setMaxPlayers(val);
                    setPage(1);
                }}
                onClear={() => {
                    setFilter('');
                    setMinPlayers('');
                    setMaxPlayers('');
                    setPage(1);
                }}
            />
            <ServerTableBody table={table} />

            <Pagination page={page} totalPages={totalPages} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => Math.min(totalPages, p + 1))} />

            {table.getRowModel().rows.length === 0 && <TableEmptyState message='No servers found' />}
        </div>
    );
}
