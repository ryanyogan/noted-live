"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";

export async function getClerkUsers({ userIds }: { userIds: string[] }) {
  try {
    let { data } = await clerkClient.users.getUserList({
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
