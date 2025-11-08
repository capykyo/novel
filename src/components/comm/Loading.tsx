import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { Skeleton } from "@/components/ui/skeleton";

export function Loading() {
  return (
    <div className="grow flex flex-col justify-center items-center h-full gap-4">
      <Icon icon="eos-icons:bubble-loading" width="48" height="48" />
      <div className="w-full max-w-md space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}
