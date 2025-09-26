export default function MobileRestriction() {
  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-8 space-y-8">
        {/* Icon */}
        <div className="text-6xl mb-8">
          💻
        </div>

        {/* Main Title */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-light text-white leading-tight tracking-wide">
            Desktop Experience Required
          </h1>
          <div className="w-16 h-px bg-white/30 mx-auto"></div>
        </div>

        {/* Description */}
        <div className="space-y-6 text-white/75">
          <p className="text-lg font-light leading-relaxed tracking-wide">
            HomebuilderAI Interactive is optimized for desktop browsers to provide the best learning experience.
          </p>

          <p className="text-base font-light leading-relaxed tracking-wide">
            Please access this demo from a desktop computer using Chrome, Safari, Firefox, or Edge.
          </p>

          <div className="pt-4">
            <p className="text-white/60 text-sm font-light">
              Supported platforms: <span className="text-white font-medium">Mac • PC • Linux</span>
            </p>
          </div>
        </div>

        {/* Device Icons */}
        <div className="flex justify-center items-center gap-8 pt-8">
          <div className="text-center">
            <div className="text-3xl mb-2">🖥️</div>
            <p className="text-white/60 text-xs">Desktop</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">💻</div>
            <p className="text-white/60 text-xs">Laptop</p>
          </div>
          <div className="text-center opacity-30">
            <div className="text-3xl mb-2">📱</div>
            <p className="text-white/60 text-xs line-through">Mobile</p>
          </div>
          <div className="text-center opacity-30">
            <div className="text-3xl mb-2">📱</div>
            <p className="text-white/60 text-xs line-through">Tablet</p>
          </div>
        </div>

        {/* Copyright footer */}
        <div className="pt-12 text-white/50 text-sm">
          Copyright © 2025 Myers Barnes Associates, Inc. All rights reserved.
        </div>
      </div>
    </div>
  )
}