-- Cleanup intro lessons - Keep only 4 main lessons
-- Remove: Welcome, Language Selection, Goal Selection, and Time Commitment

BEGIN;

-- Step 1: Delete content for lessons we're removing
DELETE FROM intro_lesson_content 
WHERE lesson_id IN (
    '9fdc22fa-93dd-41e3-9831-7013ecddb6a2',  -- Welcome & Greeting
    '7bc44348-1493-47ec-a1c4-a47262a45be6',  -- Language Selection
    '37d45db2-e062-4bbf-8a24-3219d3af2390',  -- Goal Selection
    'dc656ab5-a46f-4775-89a1-c050135ce72a'   -- Time Commitment
);

-- Step 2: Delete the lessons themselves
DELETE FROM intro_lessons 
WHERE id IN (
    '9fdc22fa-93dd-41e3-9831-7013ecddb6a2',  -- Welcome & Greeting
    '7bc44348-1493-47ec-a1c4-a47262a45be6',  -- Language Selection
    '37d45db2-e062-4bbf-8a24-3219d3af2390',  -- Goal Selection
    'dc656ab5-a46f-4775-89a1-c050135ce72a'   -- Time Commitment
);

-- Step 3: Update order_no for remaining lessons to be sequential
UPDATE intro_lessons 
SET order_no = 1, updated_at = NOW()
WHERE id = 'aa3d3feb-86e4-462a-b41d-7d43ed02f3c7';  -- Introduction to Brahmi

UPDATE intro_lessons 
SET order_no = 2, updated_at = NOW()
WHERE id = '12f763dc-f65c-45b8-8159-cf497574dd7e';  -- History and Origin

UPDATE intro_lessons 
SET order_no = 3, updated_at = NOW()
WHERE id = '61212a9c-1ff3-4e09-a606-4da2af73d77d';  -- Script vs. Language

UPDATE intro_lessons 
SET order_no = 4, updated_at = NOW()
WHERE id = '1d586ff8-9ff3-4e78-9e07-e49fd75a6340';  -- Spiritual Significance

-- Step 4: Verify remaining lessons
SELECT 
    order_no,
    title,
    subtitle,
    lesson_id,
    estimated_time_minutes
FROM intro_lessons 
ORDER BY order_no;

-- Step 5: Verify content count for remaining lessons
SELECT 
    il.title,
    COUNT(ilc.id) as content_count
FROM intro_lessons il
LEFT JOIN intro_lesson_content ilc ON il.id = ilc.lesson_id
GROUP BY il.id, il.title
ORDER BY il.order_no;

COMMIT;

-- Summary:
-- ✓ Removed 4 lessons (Welcome, Language Selection, Goal Selection, Time Commitment)
-- ✓ Removed all their content (3 content items)
-- ✓ Kept 4 core lessons with sequential ordering
-- ✓ Total content items remaining: ~25 slides across 4 lessons
