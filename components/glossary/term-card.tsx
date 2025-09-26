'use client'

import { useState } from 'react'
import { Term } from '@/lib/types'
import Button from '@/components/ui/button'
import Modal from '@/components/ui/modal'
import Badge from '@/components/ui/badge'

interface TermCardProps {
  term: Term
  onComplete?: (termId: string) => void
  isCompleted?: boolean
}

export default function TermCard({ term, onComplete, isCompleted = false }: TermCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [currentStep, setCurrentStep] = useState<'explainer' | 'quiz' | 'action'>('explainer')
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [actionSaved, setActionSaved] = useState(false)

  const handleQuizSubmit = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === term.quiz[0].correctIndex
    if (isCorrect) {
      setQuizCompleted(true)
      setTimeout(() => setCurrentStep('action'), 1500)
    }
  }

  const handleActionSave = () => {
    setActionSaved(true)
    if (onComplete) {
      onComplete(term.id)
    }
    setTimeout(() => {
      setShowModal(false)
      setCurrentStep('explainer')
      setSelectedAnswer(null)
      setQuizCompleted(false)
      setActionSaved(false)
    }, 1500)
  }

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className={`card cursor-pointer card-hover ${
          isCompleted ? 'border-green-400/30 bg-green-500/5' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-lg">{term.title}</h4>
          {isCompleted && <Badge variant="success" size="sm">✓</Badge>}
        </div>
        <p className="text-sm opacity-80 mb-4">{term.oneLine}</p>
        <div className="text-xs text-sky-400">
          Click to explore → 90s explainer → quiz → action
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={term.title}
        size="lg"
      >
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setCurrentStep('explainer')}
              className={`px-3 py-1 rounded-lg ${
                currentStep === 'explainer'
                  ? 'bg-sky-500/20 text-sky-300 font-medium'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              1. Explainer
            </button>
            <span className="text-secondary">→</span>
            <button
              onClick={() => setCurrentStep('quiz')}
              className={`px-3 py-1 rounded-lg ${
                currentStep === 'quiz'
                  ? 'bg-sky-500/20 text-sky-300 font-medium'
                  : 'text-secondary hover:text-primary'
              }`}
              disabled={currentStep === 'explainer'}
            >
              2. Quiz
            </button>
            <span className="text-secondary">→</span>
            <button
              onClick={() => setCurrentStep('action')}
              className={`px-3 py-1 rounded-lg ${
                currentStep === 'action'
                  ? 'bg-sky-500/20 text-sky-300 font-medium'
                  : 'text-secondary hover:text-primary'
              }`}
              disabled={!quizCompleted}
            >
              3. Action
            </button>
          </div>

          {/* Content based on current step */}
          {currentStep === 'explainer' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-primary">90-Second Explainer</h3>
                <p className="text-primary leading-relaxed">{term.explainer90s}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-primary">Field Analogy</h3>
                <p className="text-primary italic leading-relaxed opacity-90">{term.fieldAnalogy}</p>
              </div>

              <div className="pt-4">
                <Button onClick={() => setCurrentStep('quiz')} className="w-full">
                  Take Quiz →
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'quiz' && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4 text-primary">Quick Quiz</h3>
              <div className="p-4 bg-white/10 dark:bg-white/10 rounded-xl border border-white/30">
                <p className="mb-4 text-primary font-medium">{term.quiz[0].question}</p>
                <div className="space-y-2">
                  {term.quiz[0].answers.map((answer, index) => (
                    <label
                      key={index}
                      className={`block p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedAnswer === index
                          ? 'border-sky-400 bg-sky-400/20 text-white font-medium'
                          : 'border-white/30 hover:border-white/50 hover:bg-white/10 text-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="quiz-answer"
                        value={index}
                        checked={selectedAnswer === index}
                        onChange={() => setSelectedAnswer(index)}
                        className="sr-only"
                      />
                      {answer}
                    </label>
                  ))}
                </div>
              </div>

              {quizCompleted ? (
                <div className="text-center p-4 bg-green-500/20 rounded-xl border border-green-500/30">
                  <p className="text-green-400 font-semibold">✓ Correct! Moving to action step...</p>
                </div>
              ) : (
                <Button
                  onClick={handleQuizSubmit}
                  disabled={selectedAnswer === null}
                  className="w-full"
                >
                  Submit Answer
                </Button>
              )}
            </div>
          )}

          {currentStep === 'action' && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-2 text-primary">One Action Today</h3>
              <div className="p-4 bg-orange-500/20 rounded-xl border border-orange-500/30">
                <p className="text-primary font-medium">{term.oneActionToday}</p>
              </div>

              {actionSaved ? (
                <div className="text-center p-4 bg-green-500/20 rounded-xl border border-green-500/30">
                  <p className="text-green-400 font-semibold">✓ Action saved! Term completed.</p>
                </div>
              ) : (
                <Button onClick={handleActionSave} className="w-full" variant="primary">
                  Save Action & Complete Term
                </Button>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}