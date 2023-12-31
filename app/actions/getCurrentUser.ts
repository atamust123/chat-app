import getSession from "./getSession";
import prisma  from "@/app/libs/prismadb"

export const getCurrentUser = async ()=>{
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return null;
        }
        const currentUser = await prisma?.user.findUnique({where:{email:session?.user?.email}});

        return currentUser || null;

    } catch (error:any) {
        return null;
    }
}