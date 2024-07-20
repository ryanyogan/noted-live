import { CollaborativeRoom } from "@/components/collaborative-room";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Document({ params: { id } }: SearchParamProps) {
  let clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  let room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  if (!room) {
    redirect("/");
  }

  let userIds = Object.keys(room.usersAccesses);
  let users = await getClerkUsers({ userIds });

  let usersData = users.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes("room:write")
      ? "editor"
      : "viewer",
  }));

  let currentUserType: UserType = room.usersAccesses[
    clerkUser.emailAddresses[0].emailAddress
  ]?.includes("room:write")
    ? "editor"
    : "viewer";

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        users={usersData}
        currentUserType={currentUserType}
        roomId={id}
        roomMetadata={room.metadata}
      />
    </main>
  );
}
