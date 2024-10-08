import { CurrentProfile } from "@/lib/CurrentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE (
  req: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    const profile = await CurrentProfile();
    
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!serverId) return new NextResponse("Server not found", { status: 404 });
    if (!params.memberId) return new NextResponse("Member not found", { status: 404 });

    const server = await db.server.update({
      where:{
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  }catch (e) {
    console.log("[MEMBERS_ID_DELETE] Error", e);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PATCH (
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await CurrentProfile();
    
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();
    
    const serverId = searchParams.get("serverId");
    
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!serverId) return new NextResponse("Server not found", { status: 404 });
    if (!params.memberId) return new NextResponse("Member not found", { status: 404 });

    const server = await db.server.update({
      where:{
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  }catch (e) {
    console.log("[MEMBERS_ID_PATCH] Error", e);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}