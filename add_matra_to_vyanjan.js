const fs = require('fs');

let code = fs.readFileSync('lib/vyanjanModule.ts', 'utf8');

// 1. Add import for matras.json
if (!code.includes("import matraData")) {
  code = code.replace("import vyanjanData from '@/backend/data/vyanjan.json'", "import vyanjanData from '@/backend/data/vyanjan.json'\nimport matraData from '@/backend/data/matras.json'");
}

// 2. Update getVyanjanLessonContent loop to include combination slides
const targetBlock = `        // Add tracer
        content.push({
          id: \`\${lessonId}-tracer-\${c.id}\`,
          lesson_id: lessonId,
          content_type: 'writing_practice',
          title: \`अभ्यास (Practice) - \${c.devanagari}\`,
          content: \`ब्राह्मी लिपि में '\${c.devanagari}' का अभ्यास करें\`,
          metadata: {
            character: c.brahmi
          },
          order_no: orderNo++
        })`;

const replacementBlock = `        // Add tracer
        content.push({
          id: \`\${lessonId}-tracer-\${c.id}\`,
          lesson_id: lessonId,
          content_type: 'writing_practice',
          title: \`अभ्यास (Practice) - \${c.devanagari}\`,
          content: \`ब्राह्मी लिपि में '\${c.devanagari}' का अभ्यास करें\`,
          metadata: {
            character: c.brahmi
          },
          order_no: orderNo++
        })
        
        // Add Matra Combinations from matraData
        const comboData = (matraData.consonantMatraCombinations as unknown as any[]).find(combo => combo.consonantId === c.id);
        if (comboData) {
            // Visual guide
            const formsContent = comboData.forms.map((f: any) => \`\${f.combinedDevanagari} = \${f.combinedBrahmi}\`).join('\\n');
            content.push({
                id: \`\${lessonId}-combo-\${c.id}\`,
                lesson_id: lessonId,
                content_type: 'key_points',
                title: \`\${c.devanagari} के मात्रा रूप\`,
                content: formsContent,
                metadata: null,
                order_no: orderNo++
            } as any);

            // MCQs
            content.push({
                id: \`\${lessonId}-mcq1-\${c.id}\`,
                lesson_id: lessonId,
                content_type: 'mcq',
                title: "पूरा कीजिए",
                content: \`ब्राह्मी मात्रा '𑀹' (इ-मात्रा) जोड़ने पर क्या बनेगा?\\n\${c.devanagari} + 𑀹 = ?\`,
                metadata: {
                    options: [\`\${c.devanagari}ा\`, \`\${c.devanagari}ि\`, \`\${c.devanagari}ु\`],
                    correct_answer: \`\${c.devanagari}ि\`
                },
                order_no: orderNo++
            } as any);

            content.push({
                id: \`\${lessonId}-mcq2-\${c.id}\`,
                lesson_id: lessonId,
                content_type: 'mcq',
                title: "सही मिलान कीजिए",
                content: \`\${c.devanagari} + उ-मात्रा का ब्राह्मी रूप क्या होगा?\`,
                metadata: {
                    options: [\`\${c.brahmi}𑀸\`, \`\${c.brahmi}𑀻\`, \`\${c.brahmi}𑁄\`],
                    correct_answer: \`\${c.brahmi}𑀻\`
                },
                order_no: orderNo++
            } as any);

            content.push({
                id: \`\${lessonId}-mcq3-\${c.id}\`,
                lesson_id: lessonId,
                content_type: 'mcq',
                title: "उल्टा अभ्यास",
                content: \`यह कौन सी मात्रा है: \${c.brahmi}𑁃\`,
                metadata: {
                    options: ["इ-मात्रा", "ऐ-मात्रा", "ए-मात्रा"],
                    correct_answer: "ऐ-मात्रा"
                },
                order_no: orderNo++
            } as any);

            // Tracing practice forms
            const formsToTrace = [
                {name: "कोई नहीं (अ)", sign: ""},
                {name: "आ-मात्रा", sign: "𑀸"},
                {name: "इ-मात्रा", sign: "𑀹"},
                {name: "उ-मात्रा", sign: "𑀻"},
                {name: "ए-मात्रा", sign: "𑁂"},
                {name: "अनुस्वार (अं)", sign: "𑁀"}
            ];

            formsToTrace.forEach((ft, idx) => {
                content.push({
                    id: \`\${lessonId}-trace-\${c.id}-\${idx}\`,
                    lesson_id: lessonId,
                    content_type: 'writing_practice',
                    title: \`ट्रेसिंग: \${ft.name}\`,
                    content: \`\${c.devanagari} के साथ \${ft.name} का अभ्यास करें\`,
                    metadata: { character: c.brahmi + ft.sign },
                    order_no: orderNo++
                } as any);
            });
        }`;

if (code.includes(targetBlock)) {
  code = code.replace(targetBlock, replacementBlock);
  fs.writeFileSync('lib/vyanjanModule.ts', code);
  console.log("Updated lib/vyanjanModule.ts successfully.");
} else {
  console.log("Could not find target block in vyanjanModule.ts");
}
