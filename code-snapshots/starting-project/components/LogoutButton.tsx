'use client';

import { signOutAction } from '@/lib/actions';

export default function LogoutButton({ userName }: { userName: string }) {
  return (
    <form action={signOutAction} className='flex items-center gap-3'>
      <span className='hidden text-sm text-gray-500 dark:text-gray-400 sm:block'>{userName}</span>
      <button
        type='submit'
        className='text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer'
      >
        Log out
      </button>
    </form>
  );
}
