import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import Link from 'next/link'

interface BaseProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  className?: string
}

interface ButtonProps extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  href?: never
  children: React.ReactNode
}

interface LinkProps extends BaseProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> {
  href: string
  children: React.ReactNode
}

type Props = ButtonProps | LinkProps

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  href,
  ...props
}: Props) {
  const variants = {
    primary: 'btn-primary focus-ring',
    secondary: 'btn-secondary focus-ring',
    outline: clsx(
      'inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 focus-ring',
      'border-2 border-current',
      'text-info hover:bg-info hover:text-white',
      'bg-transparent hover:border-transparent'
    ),
    ghost: clsx(
      'inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 focus-ring',
      'text-secondary hover:text-primary',
      'hover:bg-black hover:bg-opacity-5',
      'dark:hover:bg-white dark:hover:bg-opacity-5'
    )
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const baseClasses = clsx(
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variant === 'primary' || variant === 'secondary' ? '' : sizes[size],
    variants[variant],
    className
  )

  if (href) {
    return (
      <Link href={href} className={baseClasses} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </Link>
    )
  }

  return (
    <button
      className={baseClasses}
      disabled={loading || (props as ButtonHTMLAttributes<HTMLButtonElement>).disabled}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
}