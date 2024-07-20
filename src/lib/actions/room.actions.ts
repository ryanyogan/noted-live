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

    // return room;
    return parseStringify(room);
  } catch (error) {
    console.log(`Error fetching document/room: ${error}`);
  }
}

export async function getDocuments({ email }: { email: string }) {
  try {
    let rooms = await liveblocks.getRooms({ userId: email });

    return parseStringify(rooms);
  } catch (error) {
    console.log(`Error fetching document/rooms: ${error}`);
  }
}

export async function updateDocument({
  roomId,
  title,
}: {
  roomId: string;
  title: string;
}) {
  try {
    let updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error fetching document/room: ${error}`);
  }
}
