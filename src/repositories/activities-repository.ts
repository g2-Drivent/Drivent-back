import { prisma } from "@/config"

async function getAvailableDays() {

}

async function getAvailableTimes() {

}

async function postActivity(userId: number, activityId: number) {
    return (prisma.register.create({
        data: {
            userId,
            activityId
        }
    })
    )
}

async function getTimeById(id: number) {
    const times = await prisma.activity.findUnique({
        where: { id },
        select: {
            date: true,
            duration: true,
            capacity: true
        }
    })
    return times;
}

async function getInterval(userId: number) {
    const conflict = await prisma.register.findMany({
        where: {
            userId,
        },
        include: {
            Activity: {
                select: {
                    date: true,
                    duration: true
                }
            }
        }
    })
    return conflict;
}

async function countRegisterd(activityId: number) {
    const total = prisma.register.count({
        where: {
            activityId
        }
    })
    return total;
}

async function checkActivity(activityId: number, userId: number) {
    const activities = await prisma.register.findFirst({
        where: {
            userId,
            activityId
        }
    })
    return activities;
}

export const activitiesRepository = {
    getAvailableDays,
    getAvailableTimes,
    postActivity,
    getTimeById,
    getInterval,
    countRegisterd,
    checkActivity
}