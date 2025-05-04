// lib/otpTimer.ts
export const OTP_RESEND_INTERVAL = 60;

export const getRemainingSeconds = (lastSentTime: number): number => {
  const now = Date.now();
  const diff = Math.floor((now - lastSentTime) / 1000);
  return Math.max(0, OTP_RESEND_INTERVAL - diff);
};
