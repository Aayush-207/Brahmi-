-- =====================================================
-- UNLOCK VYANJAN MODULE
-- Run this after setting up the vyanjan module tables
-- =====================================================

-- Unlock the vyanjan module
UPDATE public.modules
SET is_locked = FALSE
WHERE module_id = 'module-vyanjan';

-- Verify the update
SELECT module_id, title, is_locked, route 
FROM public.modules 
WHERE module_id = 'module-vyanjan';

-- Check vyanjan lessons count
SELECT COUNT(*) as lesson_count 
FROM public.vyanjan_lessons;

-- Check vyanjan content count
SELECT COUNT(*) as content_count 
FROM public.vyanjan_lesson_content;

DO $$
BEGIN
    RAISE NOTICE '✅ Vyanjan module unlocked and ready for use!';
END $$;
