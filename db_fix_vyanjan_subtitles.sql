-- Fix Vyanjan Lesson Subtitles - Update to Clear Hindi Descriptions
-- This corrects the subtitle for lesson 2 and ensures all are in proper Hindi

DO $$
DECLARE
    vyanjan_module_id UUID;
BEGIN
    -- Get the vyanjan module ID
    SELECT id INTO vyanjan_module_id FROM public.modules WHERE module_id = 'module-vyanjan';

    -- Update all lesson subtitles for clarity and consistency
    
    -- Lesson 1
    UPDATE public.vyanjan_lessons 
    SET subtitle = 'व्यञ्जनों का परिचय'
    WHERE module_id = vyanjan_module_id AND lesson_id = 'vyanjan-lesson-1';

    -- Lesson 2: क वर्ग (Ka-Varga)
    UPDATE public.vyanjan_lessons 
    SET subtitle = 'कण्ठ्य व्यञ्जन'
    WHERE module_id = vyanjan_module_id AND lesson_id = 'vyanjan-lesson-2';

    -- Lesson 3: च वर्ग (Cha-Varga)
    UPDATE public.vyanjan_lessons 
    SET subtitle = 'तालव्य व्यञ्जन'
    WHERE module_id = vyanjan_module_id AND lesson_id = 'vyanjan-lesson-3';

    -- Lesson 4: ट वर्ग (Ta-Varga Retroflex)
    UPDATE public.vyanjan_lessons 
    SET subtitle = 'मूर्धन्य व्यञ्जन'
    WHERE module_id = vyanjan_module_id AND lesson_id = 'vyanjan-lesson-4';

    -- Lesson 5: त वर्ग (Ta-Varga Dental)
    UPDATE public.vyanjan_lessons 
    SET subtitle = 'दन्त्य व्यञ्जन'
    WHERE module_id = vyanjan_module_id AND lesson_id = 'vyanjan-lesson-5';

    -- Lesson 6: प वर्ग (Pa-Varga)
    UPDATE public.vyanjan_lessons 
    SET subtitle = 'ओष्ठ्य व्यञ्जन'
    WHERE module_id = vyanjan_module_id AND lesson_id = 'vyanjan-lesson-6';

    -- Lesson 7: अन्तःस्थ (Antastha)
    UPDATE public.vyanjan_lessons 
    SET subtitle = 'अर्ध-स्वर'
    WHERE module_id = vyanjan_module_id AND lesson_id = 'vyanjan-lesson-7';

    -- Lesson 8: ऊष्म (Ushma)
    UPDATE public.vyanjan_lessons 
    SET subtitle = 'ऊष्म व्यञ्जन'
    WHERE module_id = vyanjan_module_id AND lesson_id = 'vyanjan-lesson-8';

    RAISE NOTICE 'All vyanjan lesson subtitles updated successfully';
END $$;
