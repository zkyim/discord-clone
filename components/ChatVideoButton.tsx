"use client"
import React from 'react'
import qs from "query-string";
import ActionTooltip from './ActionTooltip';
import { Video, VideoOff } from 'lucide-react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

const ChatVideoButton = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isVideo = searchParams?.get("video");
  const Icon =  isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "End video call" : "Start video call";

  const onClick = () => {
    const url = qs.stringifyUrl({
      url: pathname || "",
      query: {
        video: isVideo ? undefined : true,
      },
    }, {skipNull: true});

    router.push(url);
  }
  return (
    <ActionTooltip side='bottom' label={tooltipLabel}>
      <button onClick={onClick} className='hover:opacity-75 transition mr-4'>
        <Icon className='h-6 w-6 text-zinc-500 dark:text-zinc-400'/>
      </button>
    </ActionTooltip>
  )
}

export default ChatVideoButton
