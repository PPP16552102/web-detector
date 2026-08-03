export function initPvCapture() {
  const start = Date.now()

  const data = {
    type: 'pv',
    referrer: document.referrer,
    timestamp: start,
  }

  console.log('data -> ', data)

  const sendStayTime = () => {
    const report = {
      type: 'stay_time',
      duration: Date.now() - start,
      timestamp: Date.now(),
    }

    console.log('send report -> ', report)
  }

  window.addEventListener('beforeunload', sendStayTime)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') sendStayTime()
  })
}
