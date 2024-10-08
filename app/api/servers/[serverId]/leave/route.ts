import { CurrentProfile } from "@/lib/CurrentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH (
  req: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await CurrentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!params.serverId) return new NextResponse("Server ID not provided", { status: 404 });

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  }catch (e) {
    console.log("[SERVER_ID_LEAVE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}