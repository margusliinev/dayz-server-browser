interface TableEmptyStateProps {
    message?: string;
}

export function TableEmptyState({ message = 'No data found' }: TableEmptyStateProps) {
    return (
        <div className='text-center py-12'>
            <div className='text-4xl mb-4'>🔍</div>
            <h3 className='text-lg font-medium text-foreground mb-2'>{message}</h3>
            <p className='text-gray-400'>Check back later for available data.</p>
        </div>
    );
}
