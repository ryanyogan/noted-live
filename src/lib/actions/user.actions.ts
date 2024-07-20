"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { liveblocks } from "../liveblocks";
import { parseStringify } from "../utils";

export async function getClerkUsers({ userIds }: { userIds: string[] }) {
  try {
    let { data } = await clerkClient().users.getUserList({
      emailAddress: userIds,
    });

    let users = data.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      avatar: user.imageUrl,
    }));

    let sorderUsers = userIds.map((email) =>
      users.find((user) => user.email === email)
    );

    return parseStringify(sorderUsers);
  } catch (error) {
    console.error(error);
  }
}

export async function getDocumentUsers({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string;
  text: string;
}) {
  try {
    let room = await liveblocks.getRoom(roomId);
    let users = Object.keys(room.usersAccesses).filter(
      (email) => email !== currentUser
    );
    if (text.length) {
      let lowerText = text.toLowerCase();
      let filteredUsers = users.filter((email: string) =>
        email.toLowerCase().includes(lowerText)
      );

      return parseStringify(filteredUsers);
    }

    return parseStringify(users);
  } catch (error) {
    console.error(error);
  }
}
