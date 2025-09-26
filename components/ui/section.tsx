interface SectionProps {
  title: string
  children: React.ReactNode
  className?: string
  headerClassName?: string
}

export default function Section({ title, children, className = '', headerClassName = '' }: SectionProps) {
  return (
    <section className={`card space-y-6 ${className}`}>
      <header className={`space-y-2 ${headerClassName}`}>
        <h2 className="text-2xl font-bold text-primary leading-tight">{title}</h2>
        <div className="h-0.5 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </header>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  )
}
