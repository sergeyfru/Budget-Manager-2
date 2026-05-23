// import * as LucideIcons from "lucide-react";
import {
ShoppingCart,UtensilsCrossed,Car,House,Tv,Laptop,Heart,Plane,Bus,Fuel,
HeartPulse,Pill,Dumbbell,GraduationCap,Book,Briefcase,ArrowDownCircle,
ArrowUpCircle,BadgeDollarSign,TrendingUp,Gift,PartyPopper,Gamepad2,
Music,Film,Coffee,Shirt,ShoppingBag,Scissors,Wrench,Lightbulb,Wifi,
Droplets,Shield,FileText,Banknote,Dog,Cat,Baby,Users,Church,
TreePine,Palette,Camera,Code,Globe,Shapes,MoreHorizontal,Home,
Wallet,CreditCard,Building2,Smartphone,QrCode,Bitcoin,PiggyBank,
Coins,Landmark,Receipt,Utensils,Repeat,RotateCcw,ImageOff
} from "lucide-react"

const iconsOptions ={
ShoppingCart,UtensilsCrossed,Car,House,Tv,Laptop,Heart,Plane,Bus,Fuel,
HeartPulse,Pill,Dumbbell,GraduationCap,Book,Briefcase,ArrowDownCircle,
ArrowUpCircle,BadgeDollarSign,TrendingUp,Gift,PartyPopper,Gamepad2,
Music,Film,Coffee,Shirt,ShoppingBag,Scissors,Wrench,Lightbulb,Wifi,
Droplets,Shield,FileText,Banknote,Dog,Cat,Baby,Users,Church,
TreePine,Palette,Camera,Code,Globe,Shapes,MoreHorizontal,Home,
Wallet,CreditCard,Building2,Smartphone,QrCode,Bitcoin,PiggyBank,
Coins,Landmark,Receipt,Utensils,Repeat,RotateCcw,ImageOff
}
 
type IconName = keyof typeof iconsOptions;

interface CategoryIconProps {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}

export const CustomIcon = ({ name = "ImageOff", color = "currentColor", size = 24, className }: CategoryIconProps) => {
  const Icon =
  name && name in iconsOptions
    ? iconsOptions[name as IconName]
    : ImageOff;

  return <Icon size={size} color={color} className={className} />;
};
