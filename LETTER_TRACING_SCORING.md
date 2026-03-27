# Letter Tracing Scoring System

## Overview
A pixel-based accuracy scoring system for letter tracing lessons that calculates how accurately students traced a Brahmi letter.

## Implementation

### Utility: `lib/canvasScoring.ts`
Core scoring logic with zero dependencies beyond Canvas API:

```typescript
// Main scoring function
scoreLetterTracing(guideCanvas: HTMLCanvasElement, drawingCanvas: HTMLCanvasElement): ScoringResult

// Returns:
{
  percentage: 0-100,           // Final score
  grade: "Excellent" | "Very Good" | "Good" | "Try Again",
  coverage: 0-100,             // % of letter that was traced
  precision: 0-100,            // % of strokes that matched the letter
  details: {
    referencePixels: number,   // Letter guide pixels detected
    studentPixels: number,     // Student stroke pixels detected
    correctPixels: number      // Pixels within tolerance of letter
  }
}
```

### Scoring Formula
**Final Score = (Coverage × 0.7) + (Precision × 0.3)**

- **Coverage (70%)**: How much of the reference letter was traced
  - Calculation: `(correct pixels / total letter pixels) × 100`
  
- **Precision (30%)**: How clean the trace was (avoiding extra strokes)
  - Calculation: `(correct pixels / total student pixels) × 100`

### Tolerance & Thresholds
- **Tolerance Radius**: 5px (forgiving for children's handwriting)
- **Min Student Pixels**: 50 (prevents scoring empty/nearly-empty canvas)
- **Letter Detection**: Pixels with luminance > 100 (light gray guide)
- **Stroke Detection**: Pixels with luminance < 150 and alpha > 100 (dark strokes)

### Grades
| Percentage | Grade |
|-----------|-------|
| 85-100% | Excellent 🌟 |
| 70-84% | Very Good ⭐ |
| 55-69% | Good 👍 |
| < 55% | Try Again 💪 |

## Component: `CanvasBoard.tsx`

Enhanced with scoring UI and integration:

### Props
```typescript
interface CanvasBoardProps {
  traceCharacter: string;        // Letter to trace (e.g. 'अ')
  onScoreComplete?: (result: ScoringResult) => void;  // Optional callback
}
```

### Features
- ✅ White strokes on white background with light gray guide
- ✅ "Check" button to submit and score
- ✅ "Clear" button to erase and try again
- ✅ Real-time scoring with animated results
- ✅ Visual feedback: coverage/precision breakdown
- ✅ Disabled submit until user draws something

### State Flow
```
Drawing → User traces → Check button enabled → Click Check → Scoring animation → Results card
                                                                                          ↓
                                              Try Again (clears) ← Continue (if callback provided)
```

## Usage Example

### In TraceStep (or any lesson component):
```tsx
import CanvasBoard from '@/components/course/CanvasBoard'

const MyLessonStep = () => {
  const handleScoreComplete = (result: ScoringResult) => {
    console.log(`Score: ${result.percentage}% (${result.grade})`)
    console.log(`Coverage: ${result.coverage}%, Precision: ${result.precision}%`)
    // Move to next lesson step, award points, etc.
  }

  return (
    <CanvasBoard 
      traceCharacter="अ" 
      onScoreComplete={handleScoreComplete}
    />
  )
}
```

### Direct scoring utility:
```tsx
import { scoreLetterTracing } from '@/lib/canvasScoring'

const guideCanvas = document.getElementById('guide') as HTMLCanvasElement
const drawingCanvas = document.getElementById('drawing') as HTMLCanvasElement

const result = scoreLetterTracing(guideCanvas, drawingCanvas)
console.log(`${result.percentage}% - ${result.grade}`)
```

## Technical Details

### Canvas Setup
- **Drawing Canvas** (for.user strokes):
  - Fabric.js Canvas element
  - White background, dark strokes (#111827)
  - 300×300px (standard size)

- **Guide Canvas** (for scoring reference):
  - Hidden HTML5 canvas
  - Light gray guide letter (#e5e7eb)
  - Used only for pixel detection during scoring

### Pixel Detection Algorithm
1. **Extract pixel data** from both canvases
2. **Detect letter pixels** (luminance > 100) from guide canvas
3. **Detect stroke pixels** (luminance < 150, alpha > 100) from drawing canvas
4. **Find matches**: For each student pixel, check if any letter pixel is within 5px radius
5. **Calculate coverage**: `matching pixels / total letter pixels`
6. **Calculate precision**: `matching pixels / total student pixels`
7. **Combine scores**: `(coverage × 0.7) + (precision × 0.3)`

### Performance Optimizations
- Pixel sampling every 2px (256×256 → 128×128) for speed
- Early bailout if too few strokes detected
- No real-time scoring (only on submit to avoid lag)

## Integration with Lesson Flow

### Current Flow
```
LessonRenderer
  └─ TraceStep
      └─ CanvasBoard (with scoring)
          └─ onScoreComplete callback
```

### Extending to Track Progress
```tsx
const handleScoreComplete = (result: ScoringResult) => {
  // Save to database
  await saveProgress({
    lessonId: 'swar-a',
    letter: 'अ',
    accuracy: result.percentage,
    grade: result.grade,
    timestamp: new Date()
  })
  
  // Unlock next lesson
  if (result.percentage >= 70) {
    goToNextLesson()
  } else {
    // Show encouragement
    showMessage('Try again! 💪')
  }
}
```

## Visual Feedback (Optional)

### Bonus Feature: Show Correct/Incorrect Regions
Uncomment to highlight traced regions:

```tsx
import { createFeedbackCanvas } from '@/lib/canvasScoring'

// In handleSubmit, after scoring:
const feedbackCanvas = createFeedbackCanvas(guideCanvas, drawingCanvas)
// Display feedbackCanvas as overlay with green (correct) and red (missed) regions
```

## Browser Compatibility
- ✅ All modern browsers (canvas + ImageData API)
- ✅ Mobile touch support (via Fabric.js)
- ✅ iOS/Android tested

## Future Enhancements
- [ ] Streak tracking (consecutive successful traces)
- [ ] Speed bonus (time-based scoring component)
- [ ] Visual feedback overlay (green/red regions)
- [ ] Audio feedback (success chime)
- [ ] Difficulty progression (stricter scoring for advanced levels)
- [ ] Comparison view (side-by-side with expected shape)
