import * as LucideIcons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}

export const CustomIcon = ({ name = 'ImageOff', color = 'currentColor', size = 24, className }: CategoryIconProps) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.ImageOff;
  
  return <Icon size={size} color={color} className={className}/>;
}
