'use client'

import { useState } from 'react'
import { BuyerEvent, AutomationFire } from '@/lib/types'
import Badge from '@/components/ui/badge'
import Button from '@/components/ui/button'

interface EventTimelineProps {
  events: BuyerEvent[]
  fires: AutomationFire[]
  onEventClick?: (event: BuyerEvent) => void
  onFireClick?: (fire: AutomationFire) => void
}

export default function EventTimeline({ events, fires, onEventClick, onFireClick }: EventTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<BuyerEvent | null>(null)
  const [selectedFire, setSelectedFire] = useState<AutomationFire | null>(null)

  const eventIcons: Record<string, string> = {
    view_plan: '📋',
    zoom_lot: '🔍',
    download_brochure: '📥',
    chat_message: '💬',
    cta_click: '👆',
    return_visit: '🔄'
  }

  const eventColors: Record<string, string> = {
    view_plan: 'info',
    zoom_lot: 'warning',
    download_brochure: 'success',
    chat_message: 'info',
    cta_click: 'warning',
    return_visit: 'success'
  }

  const combinedTimeline = [
    ...events.map(e => ({ type: 'event', data: e, timestamp: new Date(e.ts).getTime() })),
    ...fires.map(f => ({ type: 'fire', data: f, timestamp: Date.now() }))
  ].sort((a, b) => a.timestamp - b.timestamp)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary">Event Timeline</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sky-500"></div>
            <span className="text-primary">Buyer Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-primary">Automation Fires</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10"></div>

        <div className="space-y-4">
          {combinedTimeline.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              {/* Timeline dot */}
              <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                item.type === 'event' ? 'bg-sky-500' : 'bg-orange-500'
              }`}>
                {item.type === 'event' ?
                  eventIcons[(item.data as BuyerEvent).type] || '📊' :
                  '⚡'
                }
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {item.type === 'event' ? (
                  <div
                    className="card cursor-pointer card-hover"
                    onClick={() => {
                      setSelectedEvent(item.data as BuyerEvent)
                      onEventClick?.(item.data as BuyerEvent)
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold capitalize text-primary">
                          {(item.data as BuyerEvent).type.replace('_', ' ')}
                        </h4>
                        <Badge variant={eventColors[(item.data as BuyerEvent).type] as any} size="sm">
                          Event
                        </Badge>
                      </div>
                      <span className="text-xs text-secondary">
                        {new Date((item.data as BuyerEvent).ts).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm text-primary">
                      {Object.entries((item.data as BuyerEvent).props).map(([key, value]) => (
                        <span key={key} className="mr-3">
                          <span className="text-sky-400 font-medium">{key}:</span> <span className="text-primary">{value}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    className="card border-orange-400/30 bg-orange-500/5 cursor-pointer card-hover"
                    onClick={() => {
                      setSelectedFire(item.data as AutomationFire)
                      onFireClick?.(item.data as AutomationFire)
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-primary">Automation Fired</h4>
                        <Badge variant="warning" size="sm">Rule</Badge>
                      </div>
                      <span className="text-xs text-secondary">Now</span>
                    </div>
                    <p className="text-sm text-orange-300 mb-2 font-medium">
                      {(item.data as AutomationFire).reason}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-secondary font-medium">Actions: </span>
                        <span className="text-primary">{(item.data as AutomationFire).actions.join(', ')}</span>
                      </div>
                      <div className="flex gap-2 text-xs">
                        {(item.data as AutomationFire).deltas.signalLock && (
                          <span className="text-sky-400">
                            Signal +{(item.data as AutomationFire).deltas.signalLock}
                          </span>
                        )}
                        {(item.data as AutomationFire).deltas.commitment && (
                          <span className="text-green-400">
                            Commitment +{(item.data as AutomationFire).deltas.commitment}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-white/20 rounded-2xl p-6 max-w-md w-full backdrop-filter backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Event Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>
                ✕
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{eventIcons[selectedEvent.type]}</span>
                <div>
                  <h4 className="font-semibold capitalize text-primary">{selectedEvent.type.replace('_', ' ')}</h4>
                  <p className="text-sm text-secondary">{new Date(selectedEvent.ts).toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-primary">Properties:</h5>
                {Object.entries(selectedEvent.props).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-secondary font-medium">{key}:</span>
                    <span className="text-primary">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fire Detail Modal */}
      {selectedFire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-orange-400/30 rounded-2xl p-6 max-w-md w-full backdrop-filter backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Automation Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedFire(null)}>
                ✕
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-primary">Rule: {selectedFire.ruleId}</h4>
                <p className="text-orange-300 font-medium">{selectedFire.reason}</p>
              </div>
              <div>
                <h5 className="font-medium mb-2 text-primary">Triggered Actions:</h5>
                <ul className="space-y-1">
                  {selectedFire.actions.map((action, i) => (
                    <li key={i} className="text-sm text-primary">• {action}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2 text-primary">Score Changes:</h5>
                <div className="space-y-1 text-sm">
                  {selectedFire.deltas.signalLock && (
                    <div className="text-sky-400 font-medium">Signal Lock: +{selectedFire.deltas.signalLock}</div>
                  )}
                  {selectedFire.deltas.commitment && (
                    <div className="text-green-400 font-medium">Commitment: +{selectedFire.deltas.commitment}</div>
                  )}
                  {selectedFire.deltas.leadScore && (
                    <div className="text-primary font-medium">Lead Score: +{selectedFire.deltas.leadScore}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}