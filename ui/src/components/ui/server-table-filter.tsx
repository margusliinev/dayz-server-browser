interface ServerTableFilterProps {
    value: string;
    onChange: (value: string) => void;
}

export function ServerTableFilter({ value, onChange }: ServerTableFilterProps) {
    return (
        <div className='px-6 py-4 border-b border-gray-800 bg-gray-900'>
            <input
                type='text'
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder='Filter by server name...'
                className='w-full max-w-xs px-3 py-2 rounded bg-gray-800 text-gray-100 placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary transition-all'
            />
        </div>
    );
}
