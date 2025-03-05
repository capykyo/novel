import { ShinyButton } from "@/components/magicui/shiny-button";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
export function IconButton({
  icon,
  className,
  text,
}: {
  icon: { name: string; width: string; height: string };
  className?: string;
  text: string;
}) {
  return (
    <ShinyButton className={className}>
      <div className="flex items-center">
        <Icon icon={icon.name} width={icon.width} height={icon.height} />
        <span className="ml-2">{text}</span>
      </div>
    </ShinyButton>
  );
}
