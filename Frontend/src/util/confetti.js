export const fireConfetti = async (options) => {
  try {
    const { default: confetti } = await import('canvas-confetti');
    return confetti(options);
  } catch (err) {
    console.warn('Could not fire confetti:', err);
  }
};
