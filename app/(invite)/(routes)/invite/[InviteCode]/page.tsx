import { CurrentProfile } from '@/lib/CurrentProfile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

interface InviteCodePageProps {
  params: {
    InviteCode: string;
  }
}

const InviteCodePage = async ({
  params
}: InviteCodePageProps) => {
  const profile = await CurrentProfile();
  if (!profile) return redirect("/sign-in");

  if (!params.InviteCode) return redirect("/");

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.InviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) return redirect(`/servers/${existingServer.id}`);

  const server = await db.server.update({
    where: {
      inviteCode: params.InviteCode,
    },
    data: {
      members: {
        create: [
          { profileId: profile.id },
        ],
      },
    },
  });



  if (server) return redirect(`/servers/${server.id}`);
  
  return null;
}

export default InviteCodePage
