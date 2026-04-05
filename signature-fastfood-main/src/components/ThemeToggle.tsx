import { Moon, Sun, Laptop, Smartphone, MonitorSmartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ThemeProvider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { desktopTheme, mobileTheme, activeTheme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          className="w-10 h-10 hover:bg-muted transition-colors duration-300"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <MonitorSmartphone className="w-4 h-4" /> Theme Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Desktop Theme */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Laptop className="w-4 h-4" /> Desktop Theme
            <span className="ml-auto text-xs text-muted-foreground capitalize">{desktopTheme}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme("desktop", "light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("desktop", "dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("desktop", "system")}>System</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Mobile Theme */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" /> Mobile Theme
            <span className="ml-auto text-xs text-muted-foreground capitalize">{mobileTheme}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme("mobile", "light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("mobile", "dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("mobile", "system")}>System</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}