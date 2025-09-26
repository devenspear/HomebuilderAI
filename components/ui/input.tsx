import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
}

export function Input({ label, error, helper, className, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-white">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full rounded-xl border px-4 py-2.5',
          'border-slate-200 bg-white text-slate-900 placeholder-slate-500',
          'dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-white/50',
          'focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500',
          'dark:focus:border-sky-400 dark:focus:ring-sky-400',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helper && !error && (
        <p className="text-sm text-slate-600 dark:text-white/60">{helper}</p>
      )}
    </div>
  )
}

export function Textarea({ label, error, helper, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-white">
          {label}
        </label>
      )}
      <textarea
        className={clsx(
          'w-full rounded-xl border px-4 py-2.5 resize-vertical min-h-[100px]',
          'border-slate-200 bg-white text-slate-900 placeholder-slate-500',
          'dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-white/50',
          'focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500',
          'dark:focus:border-sky-400 dark:focus:ring-sky-400',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helper && !error && (
        <p className="text-sm text-slate-600 dark:text-white/60">{helper}</p>
      )}
    </div>
  )
}