import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SelectScrollableProps = {
  trigger: string;
  groups: {
    label: string;
    items: {
      text: string;
      value: string;
    }[];
  }[];
  value?: string;
  onValueChange?: (value: string) => void;
};

export function SelectScrollable({
  trigger,
  groups,
  value,
  onValueChange,
}: SelectScrollableProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={trigger} />
      </SelectTrigger>
      <SelectContent>
        {groups.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.text}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
