import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  let clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  let { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;

  let user = {
    id,
    info: {
      id,
      name: `${firstName} ${lastName}`,
      email: emailAddresses[0].emailAddress,
      avatar: imageUrl,
      color: getUserColor(id),
    },
  };

  let { body, status } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds: [],
    },
    {
      userInfo: user.info,
    }
  );

  return new Response(body, { status });
}
