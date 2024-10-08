import { CurrentProfile } from "@/lib/CurrentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH (
  req: Request,
  { params }: { params: { channelId: string } },
) {
  try {
    const profile = await CurrentProfile();
    const { name, type } = await req.json();
    
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!serverId) return new NextResponse("Server not found", { status: 404 });
    if (!params.channelId) return new NextResponse("channel Id not found", { status: 404 });
    if (name == "general") return new NextResponse("Name cannot be 'general'", { status: 401 });
    if (!name && type) return new NextResponse("Missing data", { status: 401 });

    console.log(params.channelId);

    const server = await db.server.update({
      where:{
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            }
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            }
          }
        },
      },
    });

    return NextResponse.json(server);
  }catch (e) {
    console.log("[MEMBERS_ID_PATCH] Error", e);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE (
  req: Request,
  { params }: { params: { channelId: string } },
) {
  try {
    const profile = await CurrentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    
    if (!serverId) return new NextResponse("Server not found", { status: 404 });
    if (!params.channelId) return new NextResponse("channel Id not found", { status: 404 });

    console.log(params.channelId);

    const server = await db.server.update({
      where:{
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            }
          },
        },
      },
      data: {
        channels: {
          delete:{
            id: params.channelId,
            name: {
              not: "general",
            },
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