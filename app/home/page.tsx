import Button from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const tiles = [
    {
      href: '/dashboard/glossary',
      title: 'Aiglish™ Glossary Lab',
      desc: '22 terms with 90‑sec explainers, analogies, and micro‑quizzes.',
      icon: '📚',
      priority: 'high',
      gradient: 'from-green-500/20 to-emerald-500/20'
    },
    {
      href: '/dashboard/drips',
      title: 'Scripts & Drips Generator',
      desc: 'Generate/edit/publish 5-21 touch sequences.',
      icon: '✉️',
      priority: 'high',
      gradient: 'from-purple-500/20 to-indigo-500/20'
    },
    {
      href: '/dashboard/simulator',
      title: 'AI Sales Flow™ Simulator',
      desc: 'Replay buyer micro‑behaviors and see which automations fire.',
      icon: '🎯',
      priority: 'high',
      gradient: 'from-orange-500/20 to-red-500/20'
    },
    {
      href: '/dashboard/frame-builder',
      title: 'AI Frame Builder',
      desc: 'Upload sitemap → Consistency Heatmap → SigFrame™ checklist.',
      icon: '🏗️',
      priority: 'medium',
      gradient: 'from-indigo-500/20 to-blue-500/20'
    },
    {
      href: '/dashboard/audit',
      title: 'AI Visibility Audit',
      desc: '\"Can AI see you?\" score and top fixes.',
      icon: '🔍',
      priority: 'medium',
      gradient: 'from-red-500/20 to-pink-500/20'
    },
    {
      href: '/dashboard/scoring',
      title: 'Lead Scoring Workbench',
      desc: 'Tune weights and thresholds; simulate cohorts.',
      icon: '⚖️',
      priority: 'medium',
      gradient: 'from-yellow-500/20 to-orange-500/20'
    },
    {
      href: '/dashboard/bot-studio',
      title: 'MarvelBot™ Studio',
      desc: 'Train intents, guardrails, and handoff rules.',
      icon: '🤖',
      priority: 'medium',
      gradient: 'from-pink-500/20 to-rose-500/20'
    },
    {
      href: '/dashboard/playbooks',
      title: 'Playbooks & Cases',
      desc: '30‑minute guided wins linked to simulator + drips.',
      icon: '📋',
      priority: 'low',
      gradient: 'from-teal-500/20 to-cyan-500/20'
    },
  ]

  return (
    <div className="container py-16">
      <div className="space-y-20">
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Turn <span className="text-gradient">Aiglish™</span> into Action
            </h1>
            <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
              Interactive lab for sales teams to master AI-powered homebuilding tools.
              Learn the language, build the flows, deploy the wins.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Button variant="primary" size="lg" href="/dashboard/glossary">
              🚀 Start with Glossary
            </Button>
            <Button variant="secondary" size="lg" href="/dashboard">
              📊 View Dashboard
            </Button>
          </div>
        </div>

        {/* Modules Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-primary">Choose Your Module</h2>
            <p className="text-secondary text-lg">Eight powerful tools to transform your sales process</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tiles.map(tile => (
              <Link
                key={tile.href}
                href={tile.href}
                className="group card card-hover relative overflow-hidden min-h-[200px]"
              >
                {/* Priority indicator */}
                {tile.priority === 'high' && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg">
                      Priority
                    </div>
                  </div>
                )}

                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tile.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="pr-16">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 dark:bg-white/5 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-200">
                        {tile.icon}
                      </div>
                      <h3 className="font-bold text-primary text-xl leading-tight mb-3 group-hover:text-gradient-subtle transition-colors duration-200">
                        {tile.title}
                      </h3>
                    </div>
                    <p className="text-secondary text-sm leading-relaxed group-hover:text-primary transition-colors duration-200 mb-4 text-center">
                      {tile.desc}
                    </p>
                  </div>

                  {/* Hover arrow */}
                  <div className="flex items-center text-info opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-auto">
                    <span className="text-sm font-medium">Explore</span>
                    <svg className="w-4 h-4 ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Learning Path */}
        <section className="text-center space-y-8">
          <div className="section-divider mb-12"></div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary">Recommended Learning Path</h3>
            <p className="text-secondary">Follow this sequence for optimal results</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto">
            {[
              { name: '1. Glossary', icon: '📚', href: '/dashboard/glossary', active: true },
              { name: '2. Drips', icon: '✉️', href: '/dashboard/drips' },
              { name: '3. Simulator', icon: '🎯', href: '/dashboard/simulator' },
              { name: '4. Deploy', icon: '🚀', href: '/dashboard/playbooks' }
            ].map((step, index, array) => (
              <div key={step.name} className="flex items-center">
                <Link
                  href={step.href}
                  className={`group px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 hover:scale-105 ${
                    step.active
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white/80 dark:bg-white/10 text-secondary hover:text-primary shadow-soft'
                  }`}
                >
                  <span className="mr-2">{step.icon}</span>
                  {step.name}
                </Link>
                {index < array.length - 1 && (
                  <div className="mx-4 w-8 h-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full"></div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Button variant="outline" href="/dashboard">
              View All Modules
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}