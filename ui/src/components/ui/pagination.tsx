interface PaginationProps {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
}

export function Pagination({ page, totalPages, onPrev, onNext }: PaginationProps) {
    return (
        <div className='flex items-center justify-between px-6 py-4 bg-gray-900 border-t border-gray-800'>
            <div className='text-sm text-gray-400'>
                Page {page} of {totalPages}
            </div>
            <div className='flex gap-2'>
                <button
                    className='px-3 py-1 rounded bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors'
                    onClick={onPrev}
                    disabled={page === 1}
                >
                    Prev
                </button>
                <button
                    className='px-3 py-1 rounded bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors'
                    onClick={onNext}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
