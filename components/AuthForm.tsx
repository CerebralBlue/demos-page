"use client";

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from "@/components/ui/form"
import { CustomInput } from './CustomInput';
import { authFormSchema } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/actions/user.actions';

const AuthForm = ({ type }: { type: string }) => {

    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            console.log(data);
            // Sign up
            if (type === 'sign-up') {
                // const newUser = await signUp(data);
                // setUser(newUser);
            } else if (type === 'sign-in') {
                // const response = await signIn({
                //     email: data.email,
                //     password: data.password
                // })
                // if(response){
                //     router.push("/");
                // }
            }

            setIsLoading(false);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="auth-form">
            <header className="flex flex-col gap-5 md:gap:8">
                <Link href="/"
                    className="cursor-pointer flex items-center gap-1">
                    <Image
                        src="/icons/logo.svg"
                        width={34}
                        height={34}
                        alt="NS Automation App Logo" />
                    <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1"> NS Automation App</h1>
                </Link>

                <div className="flex flex-col gap-1 md:gap-3">
                    <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
                        {user
                            ? 'Link Account'
                            : type === 'sign-in'
                                ? 'Sign In'
                                : 'Sign Up'}
                        <p className='text-16 font-normal text-gray-600'>
                            {user
                                ? 'Link your account to get started'
                                : 'Please enter your detrails'

                            }
                        </p>
                    </h1>
                </div>
            </header>
            {user ? (
                <div className="flex flex-col gap-4">
                    {/* Plaid Link */}
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {type === "sign-up" && (
                                <>
                                    <div className="flex gap-4">
                                        <CustomInput control={form.control} name="firstName" label="First name" placeholder="Enter your first name" />
                                        <CustomInput control={form.control} name="lastName" label="Last name" placeholder="Enter your last name" />
                                    </div>
                                    <div className="flex gap-4">
                                        <CustomInput control={form.control} name="city" label="City" placeholder="Enter your city" />
                                        <CustomInput control={form.control} name="address" label="Address" placeholder="Enter your address" />
                                    </div>
                                    <CustomInput control={form.control} name="dateOfBirth" label="Date of Birth" placeholder="YYYY-MM-DD" />
                                </>
                            )}

                            <CustomInput control={form.control} name="email" label="Email" placeholder="Enter your email" />
                            <CustomInput control={form.control} name="password" label="Password" placeholder="Enter your password" />

                            <div className='flex flex-col gap-4'>
                                <Button className='form-btn' type="submit" disabled={isLoading}>
                                    {isLoading ?
                                        <>
                                            <Loader2 size={20} className="animate-spin" /> &nbsp;
                                            Loading ...
                                        </> : type === "sign-in" ? "Sign In" : "Sign Up"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <footer className='flex justify-center gap-1'>
                        <p className='text-14 font-normal text-gray-600'> {type === "sign-in" ? "Don't have an account?" : "Already have and account?"}</p>
                        <Link className='form-link' href={type === "sign-in" ? "/sign-up" : "sign-in"} >
                            {type === "sign-in" ? "Sign up" : "Sign in"}
                        </Link >
                    </footer>
                </>
            )}
        </section>
    )
}

export default AuthForm