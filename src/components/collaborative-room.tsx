"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { ActiveCollaborators } from "./active-collaborators";
import { Editor } from "./editor/Editor";
import { Header } from "./header";
import { Loader } from "./loader";

export function CollaborativeRoom({
  roomId,
  roomMetadata,
}: CollaborativeRoomProps) {
  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room">
          <Header>
            <div className="gap-2 flex w-fit items-center justify-center">
              <p className="document-title">My Title</p>
            </div>

            <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
              <ActiveCollaborators />

              <SignedOut>
                <SignInButton />
              </SignedOut>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </Header>
          <Editor />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
}
