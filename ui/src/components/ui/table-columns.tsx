import type { Server } from '@backend/database/schema';
import type { RowData } from '@tanstack/react-table';
import { RefreshButton } from '@/components/ui/refresh-button';
import { createColumnHelper } from '@tanstack/react-table';
import { CopyButton } from '@/components/ui/copy-button';

const columnHelper = createColumnHelper<Server>();

declare module '@tanstack/table-core' {
    interface TableMeta<TData extends RowData> {
        onRefreshServer: (server: Server) => Promise<number>;
    }
}

export const columns = [
    columnHelper.accessor('name', {
        header: 'Server Name',
        cell: (info) => <div className='font-medium text-foreground'>{info.getValue() || 'Unknown Server'}</div>,
        enableSorting: true,
        sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('map', {
        header: 'Map',
        cell: (info) => <div className='text-gray-300'>{info.getValue() || 'Unknown'}</div>,
        enableSorting: true,
        sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('players', {
        header: 'Players',
        cell: (info) => {
            const players = info.getValue();
            const maxPlayers = info.row.original.maxPlayers;
            const percentage = players && maxPlayers ? (players / maxPlayers) * 100 : 0;
            const isHigh = percentage > 80;
            const isMedium = percentage > 50;

            return (
                <div className='flex items-center gap-2'>
                    <span className='text-foreground font-medium'>
                        {players ?? 0}/{maxPlayers ?? 0}
                    </span>
                    <div className='w-16 h-2 bg-gray-700 rounded-full overflow-hidden'>
                        <div className={`h-full transition-all ${isHigh ? 'bg-red-500' : isMedium ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                    </div>
                </div>
            );
        },
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
            const playersA = (rowA.getValue('players') as number) || 0;
            const playersB = (rowB.getValue('players') as number) || 0;
            return playersA - playersB;
        },
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
            const status = info.getValue();
            const statusColors = {
                online: 'bg-green-500/20 text-green-400 border-green-500/30',
                offline: 'bg-red-500/20 text-red-400 border-red-500/30',
                pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            };

            return <span className={`px-2 py-1 rounded-md text-xs font-medium border ${statusColors[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
        },
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
            const statusOrder = { online: 2, pending: 1, offline: 0 };
            const statusA = statusOrder[rowA.getValue('status') as keyof typeof statusOrder];
            const statusB = statusOrder[rowB.getValue('status') as keyof typeof statusOrder];
            return statusA - statusB;
        },
    }),
    columnHelper.accessor('address', {
        header: 'Address',
        cell: (info) => {
            const address = info.getValue();

            return (
                <div className='flex items-center gap-2'>
                    <div className='text-gray-400 font-mono text-sm'>{address}</div>
                    <CopyButton text={address} />
                </div>
            );
        },
        enableSorting: true,
        sortingFn: 'alphanumeric',
    }),
    columnHelper.display({
        id: 'refresh',
        header: '',
        cell: (info) => {
            const refreshServer = info.table.options.meta!.onRefreshServer;
            const server = info.row.original;
            return <RefreshButton onRefresh={() => refreshServer(server)} />;
        },
        enableSorting: false,
    }),
];
