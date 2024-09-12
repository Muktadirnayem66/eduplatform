"use server"

import { User } from "@/model/user-model"
import { revalidatePath } from "next/cache"
import bcrypt from 'bcryptjs'
import { validatePassword } from "@/queries/users"
export async function updateUserInfo(email, updateData) {

    try {
        const filter = {email:email}
        await User.findOneAndUpdate(filter, updateData)
        revalidatePath("/account")
    } catch (error) {
       throw new Error(error) 
    }
    
}



export async function ChangePassword(email, oldPassword, newPassword) {
    const isMatch = await validatePassword(email, oldPassword)

    if(!isMatch){
        throw new Error("Please enter a valid current password")
    }

    const hashPassword = await bcrypt.hash(newPassword,5)

    const updatePassword = {
        password: hashPassword
    }
    const filter = {email:email}
    try {
        await User.findOneAndUpdate(filter, updatePassword)
        revalidatePath("/account")
    } catch (error) {
        throw new Error(error)
    }

    
}