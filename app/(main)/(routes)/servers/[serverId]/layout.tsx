import ServerSidebar from '@/components/sidebar/ServerSidebar';
import { CurrentProfile } from '@/lib/CurrentProfile'
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'

const ServerLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode,
  params: { serverId: string }
}) => {
  const profile = await CurrentProfile();

  if (!profile) return redirect("/sing-in");

  const server = db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) return redirect("/")
  return (
    <div className='h-full'>
      <div 
        className='flex w-60 z-20 flex-col fixed inset-y-0 -left-64 md:left-[72px] '
      >
        <ServerSidebar serverId={params.serverId}/>
      </div>
      <main className='h-full md:pl-60'>
        {children}
      </main>
    </div>
  )
}

export default ServerLayout
