import { Editor } from "@/components/editor/Editor";
import { Header } from "@/components/header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Document() {
  return (
    <div>
      <Header>
        <div className="gap-2 flex w-fit items-center justify-center">
          <p className="document-title">My Title</p>
        </div>

        <SignedOut>
          <SignInButton />
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </Header>
      <Editor />
    </div>
  );
}
