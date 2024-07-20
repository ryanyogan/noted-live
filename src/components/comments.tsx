import { cn } from "@/lib/utils";
import { useIsThreadActive } from "@liveblocks/react-lexical";
import { Composer, Thread } from "@liveblocks/react-ui";
import { useThreads } from "@liveblocks/react/suspense";

function ThreadWrapper({ thread }: ThreadWrapperProps) {
  let isActive = useIsThreadActive(thread.id);

  return (
    <Thread
      thread={thread}
      className={cn(
        "comment-thread border",
        isActive && "!border-blue-500 shadow-md",
        thread.resolved && "opacity-40"
      )}
      data-state={isActive ? "active" : null}
    />
  );
}

export function Comments() {
  let { threads } = useThreads();

  return (
    <div className="comments-container">
      <Composer className="comment-composer" />

      {threads.map((thread) => (
        <ThreadWrapper key={thread.id} thread={thread} />
      ))}
    </div>
  );
}
