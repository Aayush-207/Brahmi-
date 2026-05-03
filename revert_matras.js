const fs = require('fs');

// 1. Revert matras.json
const matrasData = JSON.parse(fs.readFileSync('backend/data/matras.json', 'utf8'));
matrasData.lessons = matrasData.lessons.slice(0, 13);
fs.writeFileSync('backend/data/matras.json', JSON.stringify(matrasData, null, 2));
console.log('Reverted matras.json to 13 lessons.');

// 2. Revert lib/matraModule.ts
let matraModule = fs.readFileSync('lib/matraModule.ts', 'utf8');

// I will just completely rewrite getMatraLessonContent back to what it was before comboData
const newContent = `export async function getMatraLessonContent(lessonId: string, language: string = 'hi'): Promise<MatraLessonContent[]> {
  console.log(\`[getMatraLessonContent] Returning matra content for lesson: \${lessonId}\`)
  // Find the lesson
  const lesson = (matraData.lessons as unknown as MatraLesson[]).find(l => l.lesson_id === lessonId)
  if (!lesson) return []
  
  // Generate content based on lesson
  const content: MatraLessonContent[] = []
  
  // Find corresponding matra
  const matraIndex = lesson.id - 2 // lessons 2-13 map to matras 1-12
  let matra: any = null;
  if (matraIndex >= 0 && matraIndex < (matraData.matras as unknown as any[]).length) {
    matra = (matraData.matras as unknown as any[])[matraIndex]
  }

  // Title slide
  content.push({
    id: 1,
    lesson_id: lessonId,
    content_type: 'title_slide',
    title: lesson.title,
    content: lesson.description || '',
    audio_url: null,
    metadata: { 
      matra_symbol: lesson.matra_symbol,
      brahmi_symbol: matra && matra.matraSign ? matra.matraSign : null,
      devanagari: matra ? matra.vowelDevanagari : null,
      latin: matra ? matra.matraName : null
    },
    order_no: 1,
    language: 'hi',
    created_at: new Date().toISOString()
  })
  
  if (matra) {
    content.push({
      id: 2,
      lesson_id: lessonId,
      content_type: 'pronunciation',
      title: 'मात्रा संयोजन',
      content: matra.description || '',
      audio_url: null,
      metadata: { 
        brahmi_symbol: matra.exampleBrahmi,
        devanagari: matra.exampleDevanagari,
        sound: matra.example_combination
      },
      order_no: 2,
      language: 'hi',
      created_at: new Date().toISOString()
    })

    if (matra.matraSign && matra.matraSign !== "") {
      content.push({
        id: 3,
        lesson_id: lessonId,
        content_type: 'writing_practice',
        title: 'मात्रा अभ्यास',
        content: \`ब्राह्मी मात्रा '\${matra.matraSign}' का अभ्यास करें\`,
        audio_url: null,
        metadata: { character: matra.matraSign },
        order_no: 3,
        language: 'hi',
        created_at: new Date().toISOString()
      })
    }
  }
  
  // Add rules slide for introduction lesson
  if (lessonId === 'matras-lesson-001') {
    (matraData.matraRules as unknown as any[]).forEach((rule, idx) => {
      content.push({
        id: 10 + idx,
        lesson_id: lessonId,
        content_type: 'text',
        title: rule.title,
        content: rule.description || '',
        audio_url: null,
        metadata: { rule_data: rule },
        order_no: 3 + idx,
        language: 'hi',
        created_at: new Date().toISOString()
      })
    })
  }
  
  // Summary slide
  content.push({
    id: 100,
    lesson_id: lessonId,
    content_type: 'summary',
    title: 'सारांश',
    content: \`\${lesson.title} को सफलतापूर्वक पूरा किया!\`,
    audio_url: null,
    metadata: null,
    order_no: 50,
    language: 'hi',
    created_at: new Date().toISOString()
  })
  
  return content
}`;

// Use regex to replace the whole function
matraModule = matraModule.replace(/export async function getMatraLessonContent[\s\S]*?return content\n}/, newContent);
fs.writeFileSync('lib/matraModule.ts', matraModule);
console.log('Reverted lib/matraModule.ts.');
