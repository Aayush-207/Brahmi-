// Simple TypeScript port of the $1 Unistroke Recognizer (minimal for POC)
// Reference: Wobbrock et al., "$1 Unistroke Recognizer"

export type Point = { x: number; y: number }

const NUM_POINTS = 64
const SQUARE_SIZE = 250

function pathLength(points: Point[]) {
  let d = 0
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    d += Math.hypot(dx, dy)
  }
  return d
}

function resample(points: Point[], n = NUM_POINTS) {
  const totalLength = pathLength(points)
  const I = totalLength / (n - 1)
  const newPoints: Point[] = [points[0]]
  let D = 0
  // If the path has zero length (all points identical), just repeat the first point
  if (totalLength === 0) {
    while (newPoints.length < n) newPoints.push({ x: points[0].x, y: points[0].y })
    return newPoints
  }

  for (let i = 1; i < points.length; i++) {
    const d = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)
    if ((D + d) >= I) {
      const qx = points[i - 1].x + ((I - D) / d) * (points[i].x - points[i - 1].x)
      const qy = points[i - 1].y + ((I - D) / d) * (points[i].y - points[i - 1].y)
      const q = { x: qx, y: qy }
      newPoints.push(q)
      points.splice(i, 0, q)
      D = 0
    } else {
      D += d
    }
  }
  // sometimes we fall short due to floating point
  while (newPoints.length < n) newPoints.push(points[points.length - 1])
  return newPoints
}

function centroid(points: Point[]) {
  const c = { x: 0, y: 0 }
  for (const p of points) {
    c.x += p.x
    c.y += p.y
  }
  c.x /= points.length
  c.y /= points.length
  return c
}

function indicativeAngle(points: Point[]) {
  const c = centroid(points)
  return Math.atan2(points[0].y - c.y, points[0].x - c.x)
}

function rotateBy(points: Point[], angle: number) {
  const c = centroid(points)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return points.map(p => ({
    x: (p.x - c.x) * cos - (p.y - c.y) * sin + c.x,
    y: (p.x - c.x) * sin + (p.y - c.y) * cos + c.y,
  }))
}

function boundingBox(points: Point[]) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const p of points) {
    minX = Math.min(minX, p.x)
    minY = Math.min(minY, p.y)
    maxX = Math.max(maxX, p.x)
    maxY = Math.max(maxY, p.y)
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
}

function scaleToSquare(points: Point[], size = SQUARE_SIZE) {
  const box = boundingBox(points)
  return points.map(p => ({
    x: (p.x - box.x) * (size / (box.width || 1)),
    y: (p.y - box.y) * (size / (box.height || 1)),
  }))
}

function translateToOrigin(points: Point[]) {
  const c = centroid(points)
  return points.map(p => ({ x: p.x - c.x, y: p.y - c.y }))
}

function vectorDistance(a: Point[], b: Point[]) {
  let d = 0
  for (let i = 0; i < a.length; i++) {
    d += Math.hypot(a[i].x - b[i].x, a[i].y - b[i].y)
  }
  return d / a.length
}

export function normalize(points: Point[]) {
  let pts = points.slice()
  // Ensure there are at least two points to avoid degenerate math
  if (pts.length === 0) return pts
  if (pts.length === 1) {
    // duplicate a single point so resample/rotation still works
    pts.push({ x: pts[0].x + 0.0001, y: pts[0].y + 0.0001 })
  }

  pts = resample(pts, NUM_POINTS)
  const angle = indicativeAngle(pts)
  pts = rotateBy(pts, -angle)
  pts = scaleToSquare(pts, SQUARE_SIZE)
  pts = translateToOrigin(pts)
  return pts
}

export function scoreMatch(template: Point[], candidate: Point[]) {
  const t = normalize(template)
  const c = normalize(candidate)
  const d = vectorDistance(t, c)
  // Convert distance to score: lower distance -> higher score
  // Max reasonable distance ~ SQUARE_SIZE. Map to 0-100
  const maxD = Math.hypot(SQUARE_SIZE, SQUARE_SIZE)
  const score = Math.max(0, 100 - Math.round((d / maxD) * 100))

  // Debugging logs to help diagnose zero scores
  try {
    // show sizes and a small sample of normalized points
    // eslint-disable-next-line no-console
    console.debug('[dollarOne] scoreMatch', {
      templatePoints: template.length,
      candidatePoints: candidate.length,
      normalizedTemplatePoints: t.length,
      normalizedCandidatePoints: c.length,
      sampleT0: t[0] || null,
      sampleC0: c[0] || null,
      avgDistance: d,
      maxDistance: maxD,
      score,
    })
  } catch (err) {
    // ignore logging errors in environments without console
  }
  return score
}

export default {
  normalize,
  scoreMatch,
}
