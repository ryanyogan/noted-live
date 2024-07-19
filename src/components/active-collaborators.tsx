"use client";

import { useOthers } from "@liveblocks/react/suspense";
import Image from "next/image";

export function ActiveCollaborators() {
  let others = useOthers();
  let collaborators = others.map((other) => other.info);

  return (
    <ul className="collaborators-list">
      {collaborators.map(({ color, id, avatar, name }) => (
        <li key={id}>
          <Image
            src={avatar}
            alt={name}
            width={100}
            height={100}
            className="inline-block size-8 rounded-full ring-2 ring-dark-100"
            style={{
              border: `3px solid ${color}`,
            }}
          />
        </li>
      ))}
    </ul>
  );
}
