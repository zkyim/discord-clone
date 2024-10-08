import { CurrentProfile } from '@/lib/CurrentProfile'
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'
import NavigationAction from './NavigationAction';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import NavigationItem from './NavigationItem';
import { ModeToggle } from '@/components//ModeToggle';
import { UserButton } from '@clerk/nextjs';

const NavigationSidebar = async () => {
  const profile = await CurrentProfile();

  if (!profile) return redirect("/");

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div
      className='space-y-4 flex flex-col items-center h-full text-primary w-full bg-[#E3E5E8] dark:bg-[#1E1F22] py-3'
    >
     <NavigationAction />
     <Separator 
       className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto'
     />
     <ScrollArea className='flex-1 w-full'>
      {servers.map(server => (
        <NavigationItem key={server.id} id={server.id} imageUrl={server.imageUrl} name={server.name}/>
      ))}
     </ScrollArea>
     <div className='pb-3 mt-auto flex items-center flex-col gap-y-4'>
      <ModeToggle />
      <UserButton 
        appearance={{
          elements: {
            avatarBox: "h-[48px] w-[48px]"
          }
        }}
      />
     </div>
    </div>
  )
}

export default NavigationSidebar
