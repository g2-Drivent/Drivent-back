import { prisma } from "@/config"

async function getUserRegister(userId: number) {
    return prisma.register.findMany({
        where: {
            userId: userId
        }
    })
}

export const registerRepository = {
    getUserRegister
}