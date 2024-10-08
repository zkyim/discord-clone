import CahtHeader from '@/components/chat/CahtHeader';
import ChatInput from '@/components/chat/ChatInput';
import ChatlMessages from '@/components/chat/ChatMessages';
import MediaRoom from '@/components/MediaRoom';
import { getOrCreateConversation } from '@/lib/conversation';
import { CurrentProfile } from '@/lib/CurrentProfile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'

interface MemberPageProps {
  params: {
    memberId: string;
    serverId: string;
  },
  searchParams: {
    video?: boolean;
  }
}

const MemberPage = async ({
  params,
  searchParams
}: MemberPageProps) => {
  const profile = await CurrentProfile();
  if (!profile) return redirect("/sign-in");

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });
  if (!currentMember) return redirect("/");

  const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

  if (!conversation) return redirect(`/severs/${params.serverId}`);

  const { memberOne, memberTwo} = conversation;

  const otheMember = memberOne.profileId === profile.id ? memberTwo : memberOne;
  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <CahtHeader 
        imageUrl={otheMember.profile.imageUrl}
        name={otheMember.profile.name}
        serverId={params.serverId}
        type='conversation'
      />
      {!searchParams.video && (
        <>
      <ChatlMessages 
        member={currentMember}
        name={otheMember.profile.name}
        chatId={conversation.id}
        type='conversation'
        apiUrl='/api/direct-messages'
        paramKey='conversationId'
        paramValue={conversation.id}
        socketUrl='/api/socket/direct-messages'
        socketQuery={{
          conversationId: conversation.id,
        }}
      />
      <ChatInput
        name={otheMember.profile.name}
        type='conversation'
        apiUrl='/api/socket/direct-messages'
        query={{
          conversationId: conversation.id,
        }}
      />
        </>
      )}
      {searchParams.video && (
        <MediaRoom 
          chatId={conversation.id}
          video={true}
          audio={true}
        />
      )}
    </div>
  )
}

export default MemberPage
