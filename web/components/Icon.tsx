import {
  Search,
  Share2,
  Download,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  X,
  Check,
  Info,
  Home,
  ChartLine,
  Scale,
  Calculator,
  FileText,
  Sun,
  Moon,
  Wheat,
  Utensils,
  DollarSign,
  Gem,
  Fuel,
  Banknote,
  Drumstick,
  User,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type React from "react";

const MAP: Record<string, LucideIcon> = {
  search: Search,
  share: Share2,
  download: Download,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  x: X,
  check: Check,
  info: Info,
  home: Home,
  chart: ChartLine,
  scale: Scale,
  calculator: Calculator,
  file: FileText,
  sun: Sun,
  moon: Moon,
  wheat: Wheat,
  food: Utensils,
  dollar: DollarSign,
  gem: Gem,
  fuel: Fuel,
  banknote: Banknote,
  drumstick: Drumstick,
  user: User,
  wallet: Wallet,
};

export type IconName = keyof typeof MAP;

export function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  ...rest
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
} & React.SVGProps<SVGSVGElement>) {
  const C = MAP[name] ?? Info;
  return <C size={size} strokeWidth={strokeWidth} {...(rest as object)} />;
}
