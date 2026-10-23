// Shared appearance and timing for the footer and hero light streaks.
export const trailPulseColors = ["#2873b9", "#318a3e", "#e22526", "#f2bb0b"];
export const trailPulseLength = 0.055;
export const trailPulseOpacity = 0.55;
export const trailPulseDuration = (index: number) => 8 + (index % 3);
export const trailPulseDelay = (index: number) => index * -0.87;
