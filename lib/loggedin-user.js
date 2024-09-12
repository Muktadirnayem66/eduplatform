import "server-only"
import { auth } from "@/auth"
import { getUserByEmail } from "@/queries/users"


export async function getLoggedInUser() {
    const session = await auth()
    if(!session) return null

    return getUserByEmail(session?.user?.email)
}