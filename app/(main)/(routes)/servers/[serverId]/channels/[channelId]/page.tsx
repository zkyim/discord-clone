import CahtHeader from '@/components/chat/CahtHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import { CurrentProfile } from '@/lib/CurrentProfile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'
import { ChannelType } from '@prisma/client';
import MediaRoom from '@/components/MediaRoom';

interface ChannelPageProps {
  params: {
    serverId: string;
    channelId: string;
  }
}

const ChannelPage = async ({
  params,
}: ChannelPageProps) => {
  const profile = await CurrentProfile();
  if (!profile) return redirect('/sign-in');

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) return redirect('/');
  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <CahtHeader 
        name={channel.name}
        serverId={channel.serverId}
        type='channel'
      />
      {channel.type === ChannelType.TEXT && (
        <>
        <ChatMessages 
          member={member}
          name={channel.name}
          chatId={channel.id}
          type='channel'
          apiUrl='/api/messages'
          socketUrl='/api/socket/messages'
          socketQuery={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
          paramKey='channelId'
          paramValue={channel.id}
        />
        <ChatInput 
          name={channel.name}
          type='channel'
          apiUrl='/api/socket/messages'
          query={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
        />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom 
          chatId={channel.id}
          video={false}
          audio={true}
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom 
          chatId={channel.id}
          video={true}
          audio={true}
        />
      )}
    </div>
  )
}

export default ChannelPage
