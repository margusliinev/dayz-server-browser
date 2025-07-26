import type { Server } from '@backend/database/schema';

interface HeaderProps {
    servers: Server[];
}

export function Header({ servers }: HeaderProps) {
    const onlineServers = servers.filter((s) => s.status === 'online').length;

    return (
        <header className='bg-background border-b border-gray-800 px-6 py-4'>
            <div className='max-w-screen-2xl mx-auto px-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 flex items-center justify-center p-1 border border-gray-600 rounded-lg'>
                            <img src='/favicon-32x32.png' alt='DayZ Server Browser' className='w-full h-full' />
                        </div>
                        <div>
                            <h1 className='text-2xl font-bold text-foreground'>DayZ Server Browser</h1>
                            <p className='text-gray-400 text-sm'>Find the perfect server to survive</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className='text-right'>
                            <p className='text-lg font-semibold text-foreground'>{servers.length}</p>
                            <p className='text-xs text-gray-400'>Servers Found</p>
                        </div>
                        <div className='text-right'>
                            <p className='text-lg font-semibold text-green-400'>{onlineServers}</p>
                            <p className='text-xs text-gray-400'>Online</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
