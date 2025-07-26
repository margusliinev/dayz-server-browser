interface ServerTableFilterProps {
    value: string;
    onChange: (value: string) => void;
    minPlayers: number | '';
    maxPlayers: number | '';
    onMinPlayersChange: (value: number | '') => void;
    onMaxPlayersChange: (value: number | '') => void;
    onClear: () => void;
}

export function ServerTableFilter({ value, onChange, minPlayers, maxPlayers, onMinPlayersChange, onMaxPlayersChange, onClear }: ServerTableFilterProps) {
    return (
        <div className='px-6 py-4 border-b border-gray-800 bg-gray-900 flex flex-col md:flex-row md:items-center gap-2 md:gap-4'>
            <input
                type='text'
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder='Filter by server name...'
                className='w-full max-w-xs px-3 py-2 rounded bg-gray-800 text-gray-100 placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary transition-all'
            />
            <div className='flex gap-2 items-center'>
                <input
                    type='number'
                    min={0}
                    value={minPlayers}
                    onChange={(e) => onMinPlayersChange(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder='Min players'
                    className='w-40 px-3 py-2 rounded bg-gray-800 text-gray-100 placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary transition-all'
                />
                <span className='text-gray-400'>-</span>
                <input
                    type='number'
                    min={0}
                    value={maxPlayers}
                    onChange={(e) => onMaxPlayersChange(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder='Max players'
                    className='w-40 px-3 py-2 rounded bg-gray-800 text-gray-100 placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary transition-all'
                />
            </div>
            <div className='flex-1 flex justify-end'>
                <button type='button' onClick={onClear} className='px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors text-sm font-medium border border-gray-600'>
                    Clear Filters
                </button>
            </div>
        </div>
    );
}
