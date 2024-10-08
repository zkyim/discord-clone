import { v4 as uuidv4 } from "uuid";

import { CurrentProfile } from "@/lib/CurrentProfile";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();

    const profile = await CurrentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name, 
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [
            { name: "general", profileId: profile.id },
          ],
        },
        members: {
          create: [
            { profileId: profile.id, role: MemberRole.ADMIN }
          ]
        }
      }
    });

    return NextResponse.json(server);
  }catch (e) {
    console.log("[SERVER_POST]",e);
    return new NextResponse("Internal Server Error", {status: 500});
  }
}