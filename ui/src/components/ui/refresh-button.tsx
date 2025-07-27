import { useState } from 'react';

interface RefreshButtonProps {
    onRefresh: () => Promise<number>;
}

export function RefreshButton({ onRefresh }: RefreshButtonProps) {
    const [refreshing, setRefreshing] = useState(false);

    const handleClick = async () => {
        setRefreshing(true);
        await onRefresh().catch(() => {});
        setRefreshing(false);
    };

    return (
        <button
            onClick={handleClick}
            disabled={refreshing}
            aria-label={refreshing ? 'Refreshing...' : 'Refresh player count'}
            title={refreshing ? 'Refreshing...' : 'Refresh player count'}
            className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-700 bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all relative ${refreshing ? 'opacity-60 cursor-not-allowed' : ''} ml-1`}
        >
            <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${refreshing ? 'opacity-0' : 'opacity-100'}`} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M17.65 6.35A7.95 7.95 0 0 0 12 4V1L7 6l5 5V7c1.93 0 3.68.78 4.95 2.05A7 7 0 1 1 5 12' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
            {refreshing && (
                <span className='absolute inset-0 flex items-center justify-center'>
                    <svg className='w-5 h-5 animate-spin text-primary' viewBox='0 0 50 50' fill='none'>
                        <circle className='opacity-20' cx='25' cy='25' r='20' stroke='currentColor' strokeWidth='5' />
                        <path className='opacity-70' fill='currentColor' d='M25 5a20 20 0 0 1 20 20h-5a15 15 0 1 0-15 15v5A20 20 0 0 1 25 5z' />
                    </svg>
                </span>
            )}
        </button>
    );
}
