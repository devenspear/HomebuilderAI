export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

  // Check for iOS devices
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream

  // Check for Android devices
  const isAndroid = /android/i.test(userAgent)

  // Check for other mobile indicators
  const isMobile = /Mobi|Android/i.test(userAgent)

  // Check for tablet indicators
  const isTablet = /iPad|Android(?=.*\bMobile\b)(?!.*\bMobile\b)|PlayBook|Silk/i.test(userAgent)

  // Check screen size as additional indicator
  const isSmallScreen = window.innerWidth <= 768 || window.innerHeight <= 768

  return isIOS || isAndroid || isMobile || (isTablet && isSmallScreen)
}

export function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop'

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

  // Check for tablets first (larger mobile devices)
  if (/iPad|Android(?=.*\bMobile\b)(?!.*\bMobile\b)|PlayBook|Silk/i.test(userAgent)) {
    return 'tablet'
  }

  // Check for mobile devices
  if (isMobileDevice()) {
    return 'mobile'
  }

  return 'desktop'
}