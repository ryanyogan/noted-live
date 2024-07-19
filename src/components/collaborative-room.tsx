"use client";

import { updateDocument } from "@/lib/actions/room.actions";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ActiveCollaborators } from "./active-collaborators";
import { Editor } from "./editor/Editor";
import { Header } from "./header";
import { Loader } from "./loader";
import { Input } from "./ui/input";

export function CollaborativeRoom({
  roomId,
  roomMetadata,
  currentUserType,
}: CollaborativeRoomProps) {
  let [editing, setEditing] = useState<boolean>(false);
  let [loading, setLoading] = useState<boolean>(false);
  let [documentTitle, setDocumentTitle] = useState(roomMetadata.title);

  let containerRef = useRef<HTMLDivElement>(null);
  let inputRef = useRef<HTMLInputElement>(null);

  async function updateTitleHandler(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setLoading(true);
      try {
        if (documentTitle !== roomMetadata.title) {
          let updatedDoc = await updateDocument({
            roomId,
            title: documentTitle,
          });

          if (updatedDoc) {
            setEditing(false);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setEditing(false);
        updateDocument({ roomId, title: documentTitle });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [roomId, documentTitle]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room">
          <Header>
            <div
              ref={containerRef}
              className="gap-2 flex w-fit items-center justify-center"
            >
              {editing && !loading ? (
                <Input
                  type="text"
                  value={documentTitle}
                  ref={inputRef}
                  placeholder="Enter title"
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  onKeyDown={updateTitleHandler}
                  disabled={!editing}
                  className="document-title-input"
                />
              ) : (
                <>
                  <p className="document-title">{documentTitle}</p>
                </>
              )}

              {currentUserType === "editor" && !editing && (
                <Image
                  src="/assets/icons/edit.svg"
                  alt="edit"
                  height={24}
                  width={24}
                  className="pointer"
                  onClick={() => setEditing(true)}
                />
              )}

              {currentUserType !== "editor" && editing && (
                <p className="view-only-tag">View only</p>
              )}

              {loading && <p className="text-sm text-gray-400">saving...</p>}
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
