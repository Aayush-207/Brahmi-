/**
 * Canvas Letter Tracing Scoring System
 * 
 * Calculates accuracy of letter tracing by:
 * - Detecting reference letter pixels (faint) from guide canvas
 * - Detecting student stroke pixels (dark) from drawing canvas
 * - Computing coverage (how much of letter was traced) and precision (how clean the trace was)
 * - Final score: (Coverage × 0.7) + (Precision × 0.3)
 */

export interface ScoringResult {
  percentage: number;
  grade: "Excellent" | "Very Good" | "Good" | "Try Again";
  coverage: number;
  precision: number;
  details: {
    referencePixels: number;
    studentPixels: number;
    correctPixels: number;
  };
}

const LETTER_DETECTION_THRESHOLD = 150; // Gray level above which pixels are considered "letter" (light gray guide)
// Increase stroke threshold to be more permissive for antialiased or light strokes
const STROKE_DETECTION_THRESHOLD = 180; // Gray level BELOW which pixels are considered "stroke" (dark strokes)
const TOLERANCE_RADIUS = 5; // pixels - forgiving tolerance for children's handwriting
// Lower minimum required student pixels to avoid false 'no-draw' on small strokes
const MIN_STUDENT_PIXELS = 5;

/**
 * Extract pixel data from canvas
 */
function getCanvasPixelData(
  canvas: HTMLCanvasElement,
): ImageData | null {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  
  try {
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  } catch (err) {
    console.error('Failed to read canvas pixels:', err);
    return null;
  }
}

/**
 * Detect letter guide pixels (light gray)
 * Used to identify what the student should trace
 */
function detectLetterPixels(imageData: ImageData): Set<string> {
  const pixels = new Set<string>();
  const data = imageData.data;
  const width = imageData.width;

  for (let y = 0; y < imageData.height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // Guide is light gray (e5e7eb ≈ 229, 231, 235) with reasonable alpha
      const luminance = (r + g + b) / 3;
      
      // Detect any noticeably light pixel (guide letter text)
      if (luminance > LETTER_DETECTION_THRESHOLD && a > 50) {
        pixels.add(`${x},${y}`);
      }
    }
  }

  console.log('Letter pixels detected:', pixels.size, 'from', imageData.width * imageData.height, 'total pixels');
  return pixels;
}

/**
 * Detect student stroke pixels (dark gray/black)
 * Fabric.js uses #111827 (gray-900) which is quite dark
 */
function detectStrokePixels(imageData: ImageData): Set<string> {
  const pixels = new Set<string>();
  const data = imageData.data;
  const width = imageData.width;

  for (let y = 0; y < imageData.height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // Detect dark pixels (strokes)
      const luminance = (r + g + b) / 3;
      
      // Accept relatively dark pixels or any pixel with meaningful alpha
      // This catches solid strokes and antialiased edges from different devices
      if ((luminance < STROKE_DETECTION_THRESHOLD && a > 10) || a > 120) {
        pixels.add(`${x},${y}`);
      }
    }
  }

  console.log('Stroke pixels detected:', pixels.size, 'Luminance threshold:', STROKE_DETECTION_THRESHOLD);
  return pixels;
}

/**
 * Count how many student pixels are within TOLERANCE_RADIUS of letter pixels
 * Returns count of matching pixels
 */
function countMatchingPixels(
  letterPixels: Set<string>,
  studentPixels: Set<string>,
  tolerance: number = TOLERANCE_RADIUS,
): number {
  let matchCount = 0;

  // Convert letter pixels to array for spatial lookup
  const letterArray = Array.from(letterPixels).map((p) => {
    const [x, y] = p.split(",").map(Number);
    return { x, y };
  });

  // For each student pixel, check if a letter pixel is nearby
  for (const studentPixel of studentPixels) {
    const [sx, sy] = studentPixel.split(",").map(Number);
    
    let found = false;
    for (const letterPixel of letterArray) {
      const dx = sx - letterPixel.x;
      const dy = sy - letterPixel.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= tolerance) {
        found = true;
        break;
      }
    }

    if (found) {
      matchCount++;
    }
  }

  return matchCount;
}

/**
 * Calculate coverage: how much of the reference letter was traced
 * = (matching pixels / total letter pixels) * 100
 */
function calculateCoverage(
  matchingPixels: number,
  totalLetterPixels: number,
): number {
  if (totalLetterPixels === 0) return 0;
  return (matchingPixels / totalLetterPixels) * 100;
}

/**
 * Calculate precision: how clean was the trace (avoiding extra strokes)
 * = (matching pixels / total student pixels) * 100
 */
function calculatePrecision(
  matchingPixels: number,
  totalStudentPixels: number,
): number {
  if (totalStudentPixels === 0) return 0;
  return (matchingPixels / totalStudentPixels) * 100;
}

/**
 * Map percentage score to grade
 */
function gradeScore(percentage: number): ScoringResult["grade"] {
  if (percentage >= 85) return "Excellent";
  if (percentage >= 70) return "Very Good";
  if (percentage >= 55) return "Good";
  return "Try Again";
}

/**
 * Main scoring function
 * Takes guide canvas (with faint letter) and drawing canvas (with student strokes)
 * Returns: { percentage: 0-100, grade, coverage, precision, details }
 */
export function scoreLetterTracing(
  guideCanvas: HTMLCanvasElement,
  drawingCanvas: HTMLCanvasElement,
): ScoringResult {
  console.log('Starting score calculation...');
  console.log('Guide canvas:', guideCanvas.width, 'x', guideCanvas.height);
  console.log('Drawing canvas:', drawingCanvas.width, 'x', drawingCanvas.height);

  // Get pixel data
  const guideData = getCanvasPixelData(guideCanvas);
  const drawingData = getCanvasPixelData(drawingCanvas);

  if (!guideData || !drawingData) {
    console.error('Failed to get canvas pixel data');
    return {
      percentage: 0,
      grade: "Try Again",
      coverage: 0,
      precision: 0,
      details: {
        referencePixels: 0,
        studentPixels: 0,
        correctPixels: 0,
      },
    };
  }

  // Detect pixels
  const letterPixels = detectLetterPixels(guideData);
  const studentPixels = detectStrokePixels(drawingData);

  console.log('Detection results:');
  console.log('- Letter pixels:', letterPixels.size);
  console.log('- Student pixels:', studentPixels.size);
  console.log('- Min required student pixels:', MIN_STUDENT_PIXELS);

  // Validate: student must have drawn something
  if (studentPixels.size < MIN_STUDENT_PIXELS) {
    console.warn('Insufficient student strokes detected');
    return {
      percentage: Math.round((studentPixels.size / Math.max(1, MIN_STUDENT_PIXELS)) * 30),
      grade: "Try Again",
      coverage: 0,
      precision: 0,
      details: {
        referencePixels: letterPixels.size,
        studentPixels: studentPixels.size,
        correctPixels: 0,
      },
    };
  }

  if (letterPixels.size === 0) {
    console.error('No guide letter pixels detected! Check guide canvas rendering.');
    return {
      percentage: 0,
      grade: "Try Again",
      coverage: 0,
      precision: 0,
      details: {
        referencePixels: 0,
        studentPixels: studentPixels.size,
        correctPixels: 0,
      },
    };
  }

  // Count matching pixels (within tolerance)
  const matchingPixels = countMatchingPixels(letterPixels, studentPixels);

  console.log('Matching pixels:', matchingPixels);

  // Calculate metrics
  const coverage = calculateCoverage(matchingPixels, letterPixels.size);
  const precision = calculatePrecision(matchingPixels, studentPixels.size);

  // Final score: (Coverage × 0.7) + (Precision × 0.3)
  const percentage = Math.round(coverage * 0.7 + precision * 0.3);

  console.log('Final calculation:');
  console.log(`- Coverage: ${coverage.toFixed(1)}% (weight: 0.7)`);
  console.log(`- Precision: ${precision.toFixed(1)}% (weight: 0.3)`);
  console.log(`- Final Score: ${percentage}%`);

  return {
    percentage: Math.max(0, Math.min(100, percentage)),
    grade: gradeScore(percentage),
    coverage: Math.round(coverage),
    precision: Math.round(precision),
    details: {
      referencePixels: letterPixels.size,
      studentPixels: studentPixels.size,
      correctPixels: matchingPixels,
    },
  };
}

/**
 * Utility to render visual feedback overlay showing:
 * - Green: correctly traced pixels
 * - Red: missed pixels from the letter
 * - Semi-transparent overlay on top of canvas
 */
export function createFeedbackCanvas(
  guideCanvas: HTMLCanvasElement,
  drawingCanvas: HTMLCanvasElement,
): HTMLCanvasElement {
  const feedbackCanvas = document.createElement("canvas");
  feedbackCanvas.width = drawingCanvas.width;
  feedbackCanvas.height = drawingCanvas.height;

  const guideData = getCanvasPixelData(guideCanvas);
  const drawingData = getCanvasPixelData(drawingCanvas);

  if (!guideData || !drawingData) return feedbackCanvas;

  const letterPixels = detectLetterPixels(guideData);
  const studentPixels = detectStrokePixels(drawingData);
  const matchingPixels = new Set<string>();

  // Find matching pixels
  for (const studentPixel of studentPixels) {
    const [sx, sy] = studentPixel.split(",").map(Number);
    
    for (const letterPixel of letterPixels) {
      const [lx, ly] = letterPixel.split(",").map(Number);
      const dx = sx - lx;
      const dy = sy - ly;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= TOLERANCE_RADIUS) {
        matchingPixels.add(studentPixel);
        break;
      }
    }
  }

  // Draw feedback
  const ctx = feedbackCanvas.getContext("2d");
  if (!ctx) return feedbackCanvas;

  // Green for correct traces
  ctx.fillStyle = "rgba(34, 197, 94, 0.5)"; // green-500 with transparency
  for (const pixel of matchingPixels) {
    const [x, y] = pixel.split(",").map(Number);
    ctx.fillRect(x, y, 2, 2);
  }

  // Red for missed areas
  ctx.fillStyle = "rgba(239, 68, 68, 0.5)"; // red-500 with transparency
  for (const pixel of letterPixels) {
    if (!matchingPixels.has(pixel)) {
      const [x, y] = pixel.split(",").map(Number);
      ctx.fillRect(x, y, 2, 2);
    }
  }

  return feedbackCanvas;
}
