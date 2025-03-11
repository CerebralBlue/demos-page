import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from "@/components/ui/input"
import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { authFormSchema } from '@/lib/utils'

const formSchema = authFormSchema("sign-up");

interface CustomInput {
    control: Control<z.infer<typeof formSchema>>,
    name: FieldPath<z.infer<typeof formSchema>>,
    label: string,
    placeholder: string,
}

export const CustomInput = ({ control, name, label, placeholder }: CustomInput) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <div className="form-item">
                    <FormItem>
                        <FormLabel className='form-label'>{label}</FormLabel>
                        <FormControl>
                            <Input placeholder={placeholder} type={name === "password" ? 'password' : "text"} className='input-class' {...field}></Input>
                        </FormControl>
                        <FormMessage className='form-message mt-2' />
                    </FormItem>
                </div>
            )}
        />
    )
}
