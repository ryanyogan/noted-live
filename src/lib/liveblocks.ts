import { Liveblocks } from "@liveblocks/node";

export let liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});
