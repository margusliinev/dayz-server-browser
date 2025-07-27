import type { Server } from '@backend/database/schema';
import { Pagination, ServerTableFilter, TableEmptyState, ServerTableBody } from '@/components/ui';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useState, useMemo, useCallback } from 'react';
import { columns } from '@/components/ui/table-columns';

interface ServerTableProps {
    servers: Server[];
    onRefreshServer: (server: Server) => Promise<number>;
}

export function ServerTable({ servers, onRefreshServer }: ServerTableProps) {
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState([{ id: 'players', desc: true }]);
    const [filter, setFilter] = useState('');
    const [minPlayers, setMinPlayers] = useState<number | ''>('');
    const [maxPlayers, setMaxPlayers] = useState<number | ''>('');
    const tableColumns = useMemo(() => columns, []);
    const pageSize = 15;

    const filteredServers = useMemo(() => {
        let result = servers;
        if (filter.trim()) {
            result = result.filter((s: Server) => s.name?.toLowerCase().includes(filter.trim().toLowerCase()));
        }
        if (minPlayers !== '') {
            result = result.filter((s: Server) => (typeof s.players === 'number' ? s.players >= minPlayers : false));
        }
        if (maxPlayers !== '') {
            result = result.filter((s: Server) => (typeof s.players === 'number' ? s.players <= maxPlayers : false));
        }
        return result;
    }, [servers, filter, minPlayers, maxPlayers]);

    const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredServers.length / pageSize)), [filteredServers.length, pageSize]);
    if (page > totalPages) setPage(1);

    const table = useReactTable({
        data: filteredServers,
        columns: tableColumns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: false,
        meta: { onRefreshServer },
        initialState: {
            sorting: [
                {
                    id: 'players',
                    desc: true,
                },
            ],
        },
    });

    const sortedRows = table.getRowModel().rows;
    const paginatedRows = useMemo(() => {
        const start = (page - 1) * pageSize;
        return sortedRows.slice(start, start + pageSize);
    }, [sortedRows, page, pageSize]);

    const handleFilterChange = useCallback((val: string) => {
        setFilter(val);
        setPage(1);
    }, []);
    const handleMinPlayersChange = useCallback((val: number | '') => {
        setMinPlayers(val);
        setPage(1);
    }, []);
    const handleMaxPlayersChange = useCallback((val: number | '') => {
        setMaxPlayers(val);
        setPage(1);
    }, []);
    const handleClear = useCallback(() => {
        setFilter('');
        setMinPlayers('');
        setMaxPlayers('');
        setPage(1);
    }, []);

    return (
        <div className='bg-gray-900 rounded-lg border border-gray-800 overflow-hidden'>
            <ServerTableFilter
                value={filter}
                onChange={handleFilterChange}
                minPlayers={minPlayers}
                maxPlayers={maxPlayers}
                onMinPlayersChange={handleMinPlayersChange}
                onMaxPlayersChange={handleMaxPlayersChange}
                onClear={handleClear}
            />
            <ServerTableBody table={table} rows={paginatedRows} />
            <Pagination page={page} totalPages={totalPages} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => Math.min(totalPages, p + 1))} />
            {paginatedRows.length === 0 && <TableEmptyState message='No servers found' />}
        </div>
    );
}
