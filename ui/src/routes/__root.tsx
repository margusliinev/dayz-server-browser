import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

function ErrorComponent() {
    return (
        <div className='min-h-screen bg-background flex items-center justify-center px-4'>
            <div className='text-center max-w-lg mx-auto'>
                <div className='mb-8'>
                    <div className='text-8xl font-bold text-primary mb-2'>⚠</div>
                    <h1 className='text-4xl font-bold text-foreground mb-4'>Something went wrong</h1>
                    <p className='text-gray-300 text-lg leading-relaxed'>An unexpected error occurred while loading the application. Please try refreshing the page.</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className='cursor-pointer px-8 py-3 bg-primary hover:bg-gray-500 text-white rounded-lg transition-colors duration-200 font-medium text-lg'
                >
                    Refresh Page
                </button>
            </div>
        </div>
    );
}

function NotFoundComponent() {
    return (
        <div className='min-h-screen bg-background flex items-center justify-center px-4'>
            <div className='text-center max-w-lg mx-auto'>
                <div className='mb-8'>
                    <div className='text-8xl font-bold text-primary mb-4'>404</div>
                    <h1 className='text-4xl font-bold text-foreground mb-4'>Page not found</h1>
                    <p className='text-gray-300 text-lg leading-relaxed'>The page you're looking for doesn't exist or has been moved.</p>
                </div>
                <Link to='/' className='px-8 py-3 bg-primary hover:bg-gray-500 text-white rounded-lg transition-colors duration-200 font-medium inline-block text-lg'>
                    Go Home
                </Link>
            </div>
        </div>
    );
}

export const Route = createRootRoute({
    component: () => (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
    errorComponent: ErrorComponent,
    notFoundComponent: NotFoundComponent,
});
