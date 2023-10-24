import { PrismaClient, TicketType } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driven.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }
  const ticketTypes: TicketType[] = await prisma.ticketType.findMany({});
  let tickets = {remote:false, presentialwithHotel:false, presentialwithoutHotel:false};
  for(let i = 0; i<ticketTypes.length;i++){
    if(ticketTypes[i].isRemote === true){
      tickets.remote = true;
    } else {
      if(ticketTypes[i].includesHotel === true){
        tickets.presentialwithHotel = true;
      } else{
        tickets.presentialwithoutHotel = true;
      }
    }
  }
  if(!tickets.remote){
    await prisma.ticketType.create({
      data:{
        name: 'remote',
        price: 300,
        isRemote: true,
        includesHotel: false
      },});
  }
  if(!tickets.presentialwithHotel){
    await prisma.ticketType.create({
      data:{
        name: 'Presential + Hotel',
        price: 500,
        isRemote: false,
        includesHotel: true
      },});
  }
  if(!tickets.presentialwithoutHotel){
    await prisma.ticketType.create({
      data:{
        name: 'Presential without Hotel',
        price: 300,
        isRemote: false,
        includesHotel: false
      },});
  }
  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
