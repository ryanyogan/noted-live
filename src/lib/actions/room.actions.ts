"use server";

import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { liveblocks } from "../liveblocks";
import { parseStringify } from "../utils";

export let createDocument = async ({ userId, email }: CreateDocumentParams) => {
  let roomId = nanoid();

  try {
    let metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };

    let usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    // TODO: Change this access back, open this up to all users
    let room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: ["room:write"],
    });

    revalidatePath("/");

    return parseStringify(room);
  } catch (error) {
    console.log(`Error creating document/room: ${error}`);
  }
};

export async function getDocument({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) {
  try {
    let room = await liveblocks.getRoom(roomId);

    let hasAccess = Object.keys(room.usersAccesses).includes(userId);
    if (!hasAccess) {
      throw new Error("You don't have access to this document");
    }

    return parseStringify(room);
  } catch (error) {
    console.log(`Error fetching document/room: ${error}`);
  }
}
