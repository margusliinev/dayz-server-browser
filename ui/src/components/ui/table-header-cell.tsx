import { flexRender } from '@tanstack/react-table';
import type { Header } from '@tanstack/react-table';

interface TableHeaderCellProps {
    header: Header<any, unknown>;
}

export function TableHeaderCell({ header }: TableHeaderCellProps) {
    const isSorted = header.column.getIsSorted();
    return (
        <th
            className={`px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gray-800/50 ${
                header.column.getCanSort() ? 'cursor-pointer select-none hover:bg-gray-700/50' : ''
            }`}
            onClick={header.column.getToggleSortingHandler()}
        >
            {header.isPlaceholder ? null : (
                <div className='flex items-center gap-2'>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                        <span className='text-gray-400 flex items-center'>
                            {isSorted === 'desc' ? (
                                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                    <path d='M5 8l5 5 5-5H5z' />
                                </svg>
                            ) : isSorted === 'asc' ? (
                                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                    <path d='M5 12l5-5 5 5H5z' />
                                </svg>
                            ) : (
                                <svg className='w-4 h-4 opacity-30' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 20 20'>
                                    <polyline points='6 12 10 8 14 12' />
                                </svg>
                            )}
                        </span>
                    )}
                </div>
            )}
        </th>
    );
}
