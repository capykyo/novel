import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

export function Loading() {
  return (
    <div className="grow flex justify-center items-center h-full">
      <Icon icon="eos-icons:bubble-loading" width="48" height="48" />
    </div>
  );
}
