import { useSettings } from "../contexts/SettingsContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Plus, Minus, ArrowUp, Grid3x3 } from "lucide-react";

const GlobalSettingsButton: React.FC = () => {
  const { theme, toggleTheme, textSize, setTextSize } = useSettings();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-20 right-4 flex flex-col gap-2">
        {/* Back to Top Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollToTop}
              className="w-8 h-8 opacity-30 hover:opacity-100 transition-opacity"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>返回顶部</p>
          </TooltipContent>
        </Tooltip>

        {/* Settings Menu */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 opacity-30 hover:opacity-100 transition-opacity"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>设置菜单</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent
            align="end"
            className="w-48"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                toggleTheme();
              }}
            >
              {theme === "light" ? (
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
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setTextSize(textSize + 1);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              增大字体
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setTextSize(Math.max(10, textSize - 1));
              }}
            >
              <Minus className="mr-2 h-4 w-4" />
              减小字体
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
};

export default GlobalSettingsButton;
