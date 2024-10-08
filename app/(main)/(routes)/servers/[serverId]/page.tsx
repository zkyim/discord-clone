import { CurrentProfile } from '@/lib/CurrentProfile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

interface ServerIdPageProps {
  params: {
    serverId: string;
  }
}

const ServerPage = async ({
  params
}: ServerIdPageProps) => {
  const profile = await CurrentProfile();
  if (!profile) return redirect("/sign-in");

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc"
        },
      },
    },
  });

  const initialChannel = server?.channels[0];

  if (!initialChannel?.name) {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
}

export default ServerPage
