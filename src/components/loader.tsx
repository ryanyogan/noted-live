import { Loader2 } from "lucide-react";

export function Loader() {
  return (
    <div className="loader">
      <Loader2 className="size-8 text-blue-200 animate-spin" />
    </div>
  );
}
