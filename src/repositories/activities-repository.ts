import { prisma } from "@/config"
import dayjs from "dayjs";

async function getAvailableDays() {
    return prisma.activity.findMany({
        select: {
            date: true
        }
    })
}

async function getAvailableTimes(date: string) {
    const startOfDay = dayjs(date).startOf('day').toISOString();
    const endOfDay = dayjs(date).endOf('day').toISOString();  
  
    return prisma.activity.findMany({
        where: {
            date: {
                gte: startOfDay,
                lte: endOfDay
            }
        },
        include: {
            Register: {
                select: {
                    userId: true
                }
            }
        }
    })    
}

async function postActivity() {
    
}

export const activitiesRepository = {
    getAvailableDays,
    getAvailableTimes,
    postActivity
}