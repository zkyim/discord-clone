import { CurrentProfile } from "@/lib/CurrentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"


export async function PATCH (
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await CurrentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.serverId) return new NextResponse("Server ID Missing", { status: 400 });

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server);
  }catch (e) {
    console.log("[SERVER_INVITE_CODE]", e);
    return new NextResponse("Intrenal Server Error", {status: 500})
  }
}