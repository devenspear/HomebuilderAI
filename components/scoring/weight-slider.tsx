'use client'

interface WeightSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  description?: string
}

export default function WeightSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  description
}: WeightSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-primary">{label}</label>
        <span className="text-sm text-sky-400 font-bold bg-sky-500/20 px-2 py-1 rounded">{value}</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${(value / max) * 100}%, rgba(255,255,255,0.1) ${(value / max) * 100}%, rgba(255,255,255,0.1) 100%)`
        }}
      />

      {description && (
        <p className="text-xs text-secondary">{description}</p>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(14, 165, 233, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(14, 165, 233, 0.3);
        }
      `}</style>
    </div>
  )
}