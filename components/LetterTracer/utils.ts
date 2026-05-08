// components/LetterTracer/utils.ts

import { Point, TracerResult } from './types'

/**
 * Normalize a point array to a 0–100 unit bounding box.
 *
 * Algorithm:
 * - Computes the bounding box of all points
 * - Translates so the bounding box starts at (0, 0)
 * - Scales uniformly so the longest dimension equals 100
 *
 * This ensures all stroke data is in a canonical coordinate space
 * that matches the reference points.
 *
 * Time complexity: O(n) where n is the number of input points
 *
 * @param points - Array of raw point coordinates
 * @returns Normalized points in 0–100 space
 */
export function normalize(points: Point[]): Point[] {
  if (points.length === 0) return []

  // Compute bounding box
  let minX = points[0].x
  let maxX = points[0].x
  let minY = points[0].y
  let maxY = points[0].y

  for (const point of points) {
    minX = Math.min(minX, point.x)
    maxX = Math.max(maxX, point.x)
    minY = Math.min(minY, point.y)
    maxY = Math.max(maxY, point.y)
  }

  const width = maxX - minX || 1
  const height = maxY - minY || 1
  const scale = 100 / Math.max(width, height)

  return points.map(p => ({
    x: (p.x - minX) * scale,
    y: (p.y - minY) * scale,
  }))
}

/**
 * Compute the Euclidean distance between two points.
 *
 * Time complexity: O(1)
 *
 * @param a - First point
 * @param b - Second point
 * @returns Euclidean distance
 */
function distance(a: Point, b: Point): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Resample a path to exactly n evenly-spaced points by arc length.
 *
 * Algorithm:
 * - Computes the total arc length (sum of segment lengths) of the input path
 * - Walks along the path, collecting points at equal arc-length intervals
 * - Uses linear interpolation between original points to find exact sample locations
 *
 * This ensures that user strokes and reference paths have the same point density,
 * making them directly comparable for scoring.
 *
 * Time complexity: O(n * m) where n is input length and m is output length (typically 64)
 * Space complexity: O(m)
 *
 * @param points - Array of input points (raw or normalized)
 * @param n - Target number of output points (typically 64)
 * @returns Array of exactly n evenly-spaced points
 */
export function resamplePath(points: Point[], n: number): Point[] {
  if (points.length < 2) return points
  if (n < 2) return [points[0]]

  // Compute total arc length and individual segment lengths
  let totalLength = 0
  const segmentLengths: number[] = []

  for (let i = 1; i < points.length; i++) {
    const len = distance(points[i - 1], points[i])
    segmentLengths.push(len)
    totalLength += len
  }

  if (totalLength === 0) return [points[0]]

  const result: Point[] = []
  const targetSpacing = totalLength / (n - 1)
  let currentLength = 0
  let pointIndex = 0

  for (let i = 0; i < n; i++) {
    const targetLength = i * targetSpacing

    // Advance through segments until we reach the target
    while (pointIndex < points.length - 1 && currentLength + segmentLengths[pointIndex] < targetLength) {
      currentLength += segmentLengths[pointIndex]
      pointIndex++
    }

    if (pointIndex >= points.length - 1) {
      // Last point
      result.push(points[points.length - 1])
    } else {
      // Interpolate within current segment
      const segmentStart = points[pointIndex]
      const segmentEnd = points[pointIndex + 1]
      const distInSegment = targetLength - currentLength
      const t = distInSegment / segmentLengths[pointIndex]

      result.push({
        x: segmentStart.x + (segmentEnd.x - segmentStart.x) * t,
        y: segmentStart.y + (segmentEnd.y - segmentStart.y) * t,
      })
    }
  }

  return result
}

/**
 * Find the distance from point p to the nearest point in the targets array.
 *
 * This implements a brute-force nearest-neighbor search, which is acceptable
 * because targets is always exactly 64 points.
 *
 * Time complexity: O(m) where m is the length of targets array
 * Space complexity: O(1)
 *
 * @param p - Query point
 * @param targets - Array of candidate points to search over
 * @returns Distance to the nearest target point
 */
export function nearestDist(p: Point, targets: Point[]): number {
  if (targets.length === 0) return 0

  let minDist = Infinity
  for (const target of targets) {
    const dist = distance(p, target)
    if (dist < minDist) {
      minDist = dist
    }
  }
  return minDist
}

/**
 * Get the tolerance bonus based on pointer type.
 *
 * Touch devices receive additional scoring leniency because they are less precise.
 * Mouse and stylus input are held to the same standard.
 *
 * Time complexity: O(1)
 * Space complexity: O(1)
 *
 * @param pointerType - The event.pointerType string from the originating pointer event
 * @returns Bonus points to add to the score (0 or 10)
 */
export function getTolerance(pointerType: string): number {
  if (pointerType === 'touch') {
    return 10
  }
  return 0
}

/**
 * Compute the score and tier for a traced path.
 *
 * Pipeline:
 * 1. Normalize the user's traced path to canonical 0–100 space
 * 2. Resample to the same number of points as the reference (typically 64)
 * 3. Compute average nearest-neighbor distance (Hausdorff metric)
 * 4. Apply scoring formula: score = 100 - avgDist * sensitivity
 * 5. Apply input-type tolerance bonus
 * 6. Map to tier based on score thresholds
 *
 * This entire function is O(n * m) and must complete in under 16ms on mid-range
 * mobile devices. The inner loop (steps 3) is the bottleneck and should use
 * cache-friendly iteration patterns.
 *
 * Time complexity: O(n * m) where n is reference length (64) and m is
 *   user path length (typically 200-2000 points). Net: ~12k-128k distance calcs.
 * Space complexity: O(m) for the resampled path
 *
 * @param userPoints - Raw points collected during drawing (in canvas pixel coordinates)
 * @param referencePoints - Pre-normalized reference path (64 points in 0–100 space)
 * @param sensitivity - Multiplier for distance penalty (typically 2; higher = stricter)
 * @param pointerType - The event.pointerType from the final pointerup event
 * @returns TracerResult with score, tier, avgDistance, and pointerType
 */
export function computeScore(
  userPoints: Point[],
  referencePoints: Point[],
  sensitivity: number,
  pointerType: string
): TracerResult {
  // Normalize and resample user path to match reference
  const normalized = normalize(userPoints)
  const resampled = resamplePath(normalized, referencePoints.length)

  // Compute average nearest-neighbor distance (Hausdorff metric)
  let totalDistance = 0
  for (const point of resampled) {
    totalDistance += nearestDist(point, referencePoints)
  }
  const avgDistance = totalDistance / resampled.length

  // Apply scoring formula
  let score = Math.max(0, Math.round(100 - avgDistance * sensitivity))

  // Apply input-type tolerance bonus
  const tolerance = getTolerance(pointerType)
  score = Math.min(100, score + tolerance)

  // Map to tier
  let tier: 'great' | 'good' | 'keep-trying' | 'try-again'
  if (score >= 80) {
    tier = 'great'
  } else if (score >= 60) {
    tier = 'good'
  } else if (score >= 40) {
    tier = 'keep-trying'
  } else {
    tier = 'try-again'
  }

  return {
    score,
    tier,
    avgDistance,
    pointerType,
  }
}
