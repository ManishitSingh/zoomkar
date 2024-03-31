import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import MobileNav from './MobileNav'
import { SignedIn, UserButton } from '@clerk/nextjs'

const Navbar = () => {
  return (
    <nav className='flex  items-center fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10 '>
      <Link href='/' className='flex flex-1 items-center gap-1 '>
        <Image src="/icons/logo.svg" alt="Zoomkar Logo" width={32} height={32} className='max-sm:size-10' />
        <p className='text-[26px] text-white max-sm:hidden'>ZoomKar</p>
      </Link>
      
      <div className='flex justify-between items-center  gap-5 '>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <div className='sm:hidden'>
      <MobileNav />

      </div>
    </nav>
  )
}

export default Navbar
