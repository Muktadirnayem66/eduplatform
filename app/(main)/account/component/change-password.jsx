"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChangePassword as changesPassword } from "@/app/actions/account";
import { toast } from "sonner";

const ChangePassword = ({email}) => {
    const [passwordState, setPasswordState] = useState({
        "oldPassword":"",
        "newPassword":""
    })

    const handleChange = (event)=>{
        const key = event.target.name 
        const value = event.target.value

        setPasswordState({...passwordState, [key]:value})

    }

    const handleSubmit = async (event)=>{
        event.preventDefault()

        
        try {
            await changesPassword(email, passwordState?.oldPassword, passwordState?.newPassword )
            toast.success(`Password changes successfully`)
        } catch (error) {
        toast.error(`Error:${error.message}`) 
        }
        
    }
    return (
        <div>
        <h5 className="text-lg font-semibold mb-4">
            Change password :
        </h5>
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5">
                <div>
                    <Label className="mb-2 block">Old password :</Label>
                    <Input
                        type="password"
                        placeholder="Old password"
                        name="oldPassword"
                        id="oldPassword"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Label className="mb-2 block">New password :</Label>
                    <Input
                        type="password"
                        placeholder="New password"
                        name="newPassword"
                        id="newPassword"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Label className="mb-2 block">
                        Re-type New password :
                    </Label>
                    <Input
                        type="password"
                        placeholder="Re-type New password"
                        required=""
                    />
                </div>
            </div>
            {/*end grid*/}
            <Button className="mt-5" type="submit">
                Save password
            </Button>
        </form>
    </div>
    );
};

export default ChangePassword;