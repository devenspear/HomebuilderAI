import { clsx } from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className
}: BadgeProps) {
  const variants = {
    default: clsx(
      'bg-white/80 text-primary backdrop-filter backdrop-blur-lg',
      'dark:bg-white/10 dark:text-white',
      'border border-black/10 dark:border-white/20'
    ),
    success: clsx(
      'bg-success text-success backdrop-filter backdrop-blur-lg',
      'border border-green-500/20'
    ),
    warning: clsx(
      'bg-warning text-warning backdrop-filter backdrop-blur-lg',
      'border border-orange-500/20'
    ),
    error: clsx(
      'bg-error text-error backdrop-filter backdrop-blur-lg',
      'border border-red-500/20'
    ),
    info: clsx(
      'bg-info text-info backdrop-filter backdrop-blur-lg',
      'border border-blue-500/20'
    )
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs font-medium',
    md: 'px-3 py-1.5 text-sm font-medium',
    lg: 'px-4 py-2 text-base font-semibold'
  }

  return (
    <span className={clsx(
      'inline-flex items-center rounded-full transition-all duration-200',
      'shadow-soft hover:shadow-lg hover:scale-105',
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  )
}