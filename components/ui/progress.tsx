import { clsx } from 'clsx'

interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'sky' | 'green' | 'orange' | 'red' | 'purple'
  showValue?: boolean
  className?: string
  label?: string
}

export default function Progress({
  value,
  max = 100,
  size = 'md',
  color = 'sky',
  showValue = false,
  className,
  label = 'Progress'
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }

  const colors = {
    sky: 'bg-gradient-to-r from-blue-500 to-sky-400',
    green: 'bg-gradient-to-r from-green-500 to-emerald-400',
    orange: 'bg-gradient-to-r from-orange-500 to-yellow-400',
    red: 'bg-gradient-to-r from-red-500 to-pink-400',
    purple: 'bg-gradient-to-r from-purple-500 to-indigo-400'
  }

  return (
    <div className={clsx('space-y-2', className)}>
      {showValue && (
        <div className="flex justify-between items-center">
          <span className="text-secondary text-sm font-medium">{label}</span>
          <span className="text-primary text-sm font-bold">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={clsx(
        'w-full rounded-full overflow-hidden transition-all duration-300',
        'bg-white/20 dark:bg-white/10',
        'backdrop-filter backdrop-blur-sm',
        sizes[size]
      )}>
        <div
          className={clsx(
            'h-full transition-all duration-700 ease-out rounded-full',
            'shadow-sm',
            colors[color]
          )}
          style={{
            width: `${percentage}%`,
            boxShadow: `0 0 8px ${color === 'sky' ? 'rgba(59, 130, 246, 0.3)' :
                                 color === 'green' ? 'rgba(34, 197, 94, 0.3)' :
                                 color === 'orange' ? 'rgba(249, 115, 22, 0.3)' :
                                 color === 'red' ? 'rgba(239, 68, 68, 0.3)' :
                                 'rgba(147, 51, 234, 0.3)'}`
          }}
        />
      </div>
    </div>
  )
}