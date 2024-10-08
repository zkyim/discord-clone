import { CurrentProfile } from "@/lib/CurrentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE (
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await CurrentProfile();
    if (!profile)  return new NextResponse("Unauthorized", { status: 401 });

    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id
      }
    });

    return NextResponse.json(server);
  }catch (e) {
    console.log("[SERVER_DELETE]", e);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH (
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await CurrentProfile();
    if (!profile)  return new NextResponse("Unauthorized", { status: 401 });

    const { name, imageUrl } = await req.json();

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server);
  }catch (e) {
    console.log("[SERVER_PATCH]", e);
    return new NextResponse("Internal server error", { status: 500 });
  }
}