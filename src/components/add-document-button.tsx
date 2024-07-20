"use client";

import { createDocument } from "@/lib/actions/room.actions";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "./ui/button";

export function AddDocumentButton({ userId, email }: AddDocumentBtnProps) {
  let router = useRouter();
  let [pending, startTransition] = useTransition();

  async function addDocumentHandler() {
    try {
      startTransition(async () => {
        let room = await createDocument({ userId, email });
        if (room) {
          router.push(`/documents/${room.id}`);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  console.log("pending", pending);

  return (
    <Button
      type="submit"
      onClick={addDocumentHandler}
      disabled={pending}
      className="gradient-blue flex gap-1 shadow-md"
    >
      {pending ? (
        <>
          <Loader2 className="size-6 animate-spin" />
        </>
      ) : (
        <>
          <Image src="/assets/icons/add.svg" alt="add" width={24} height={24} />
        </>
      )}
      <p className="hidden sm:block">Start a blank document</p>
    </Button>
  );
}
