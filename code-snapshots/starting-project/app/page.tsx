import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center'>
      <h1 className='text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl'>
        Welcome to Notes
      </h1>
      <p className='mt-4 max-w-md text-lg text-gray-500 dark:text-gray-400'>
        A simple note-taking app created with Claude
      </p>
      <div className='mt-8 flex gap-3'>
        <Link
          href='/authenticate?mode=login'
          className='rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800'
        >
          Log in
        </Link>
        <Link
          href='/authenticate?mode=register'
          className='rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200'
        >
          Sign up
        </Link>
      </div>
    </main>
  );
}
