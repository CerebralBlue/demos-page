"use client";

import React from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils';
import Footer from './InFooter';

const MobileNav = ({ user }: any) => {
    const pathname = usePathname();
    console.log(user);
    return (
        <section className='w-full max-w-[264px]'>
            <Sheet>
                <SheetTrigger>
                    <Image
                        src="/icons/hamburger.svg"
                        width={30}
                        height={30}
                        alt='menu'
                        className='cursor-pointer' />
                </SheetTrigger>
                <SheetContent className='border-none bg-white' side="left">
                    <Link href="/"
                        className="cursor-pointer flex items-center gap-1 px-4">
                        <Image
                            src="/icons/logo.svg"
                            width={34}
                            height={34}
                            alt="NS Automation App Logo" />
                        <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1"> NS Automation App</h1>
                    </Link>
                    <div className='mobilenav-sheet'>
                        <SheetClose asChild>
                            <nav className='flex h-full flex-col gap-6 pt-16 text-white'>
                                {/* {
                                    sidebarLinks.map((item) => {
                                        const isActive = pathname === item.route || pathname?.startsWith(`${item.route}`)
                                        return (
                                            <SheetClose asChild key={item.route}>
                                                <Link href={item.route} key={item.label} className={cn("mobilenav-sheet_close w-full", { "bg-bank-gradient": isActive })}>
                                                    <Image
                                                        className={cn({ 'brightness-[3] invert-0': isActive })}
                                                        src={item.imgURL}
                                                        alt={item.label}
                                                        width={20}
                                                        height={20}
                                                    />
                                                    <p className={cn('text-16 font-semibold text-black-2 ', { '!text-white': isActive })}>{item.label}</p>
                                                </Link>
                                            </SheetClose>
                                        )
                                    })
                                } */}
                                USER
                            </nav>
                        </SheetClose>
                        <Footer type="mobile" />
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    )
}

export default MobileNav