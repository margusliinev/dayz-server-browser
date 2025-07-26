interface CopyButtonProps {
    text: string;
    className?: string;
}

export function CopyButton({ text, className = '' }: CopyButtonProps) {
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    return (
        <button onClick={copyToClipboard} className={`p-1 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors ${className}`} title='Copy to clipboard'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
            </svg>
        </button>
    );
}
