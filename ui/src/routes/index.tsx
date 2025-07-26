import { createFileRoute } from '@tanstack/react-router';
import { getServers } from '@/api';
import { Header, ServerTable } from '@/components';

export const Route = createFileRoute('/')({
    component: App,
    loader: async () => await getServers(),
});

function App() {
    const servers = Route.useLoaderData();

    return (
        <div className='min-h-screen bg-background'>
            <Header servers={servers} />
            <main className='max-w-screen-2xl mx-auto px-8 py-6'>
                <ServerTable servers={servers} />
            </main>
        </div>
    );
}
