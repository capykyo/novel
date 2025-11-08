import { useSettings } from "../contexts/SettingsContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Plus, Minus, ArrowUp, Grid3x3 } from "lucide-react";

const GlobalSettingsButton: React.FC = () => {
  const { theme, toggleTheme, textSize, setTextSize } = useSettings();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-20 right-4 flex flex-col gap-2">
      {/* Back to Top Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={scrollToTop}
        className="w-8 h-8 opacity-30 hover:opacity-100 transition-opacity"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>

      {/* Settings Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 opacity-30 hover:opacity-100 transition-opacity"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => toggleTheme()}>
            {theme === "day" ? (
              <>
                <Moon className="mr-2 h-4 w-4" />
                切换到暗色模式
              </>
            ) : (
              <>
                <Sun className="mr-2 h-4 w-4" />
                切换到亮色模式
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTextSize(textSize + 1)}>
            <Plus className="mr-2 h-4 w-4" />
            增大字体
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTextSize(Math.max(10, textSize - 1))}
          >
            <Minus className="mr-2 h-4 w-4" />
            减小字体
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default GlobalSettingsButton;
