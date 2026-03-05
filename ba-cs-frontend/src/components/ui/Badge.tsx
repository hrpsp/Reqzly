import { cn } from '@/utils/cn';

export type BadgeVariant = 'yellow' | 'blue' | 'green' | 'red' | 'gray' | 'purple' | 'indigo';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  yellow: 'bg-yellow-100 text-yellow-800 ring-yellow-300/40',
  blue:   'bg-blue-100   text-blue-800   ring-blue-300/40',
  green:  'bg-green-100  text-green-800  ring-green-300/40',
  red:    'bg-red-100    text-red-800    ring-red-300/40',
  gray:   'bg-gray-100   text-gray-700   ring-gray-300/40',
  purple: 'bg-purple-100 text-purple-800 ring-purple-300/40',
  indigo: 'bg-indigo-100 text-indigo-800 ring-indigo-300/40',
};

const dotClasses: Record<BadgeVariant, string> = {
  yellow: 'bg-yellow-500',
  blue:   'bg-blue-500',
  green:  'bg-green-500',
  red:    'bg-red-500',
  gray:   'bg-gray-400',
  purple: 'bg-purple-500',
  indigo: 'bg-indigo-500',
};

export function Badge({ variant = 'gray', children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', dotClasses[variant])} />
      )}
      {children}
    </span>
  );
}

export default Badge;
