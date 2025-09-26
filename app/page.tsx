import SplashGate from '@/components/splash-gate'

// Root page shows splash gate, all other routes bypass it
export default function RootPage() {
  return <SplashGate><div /></SplashGate>
}