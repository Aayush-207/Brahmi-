-- Create user_progress table for tracking lesson completion
-- This table tracks which letters/lessons a user has completed

CREATE TABLE IF NOT EXISTS public.user_progress (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    letter_id uuid NOT NULL REFERENCES public.letters(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'current',
    completed_at timestamp with time zone DEFAULT NOW(),
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW(),
    
    -- Ensure unique combination of user and letter
    UNIQUE(user_id, letter_id),
    
    -- Ensure status is valid
    CONSTRAINT status_check CHECK (status IN ('current', 'completed'))
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_letter_id ON public.user_progress(letter_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON public.user_progress(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to manage their own progress
-- Users can view their own progress
CREATE POLICY IF NOT EXISTS "Users can view own progress"
ON public.user_progress
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY IF NOT EXISTS "Users can insert own progress"
ON public.user_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY IF NOT EXISTS "Users can update own progress"
ON public.user_progress
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own progress (for resetting)
CREATE POLICY IF NOT EXISTS "Users can delete own progress"
ON public.user_progress
FOR DELETE
USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON public.user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for easy progress statistics
CREATE OR REPLACE VIEW user_progress_summary AS
SELECT 
    user_id,
    COUNT(*) as total_lessons,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_lessons,
    COUNT(*) FILTER (WHERE status = 'current') as current_lessons,
    MAX(completed_at) FILTER (WHERE status = 'completed') as last_completion
FROM public.user_progress
GROUP BY user_id;

COMMENT ON TABLE public.user_progress IS 'Tracks user progress through Brahmi script lessons';
COMMENT ON COLUMN public.user_progress.user_id IS 'Reference to auth.users';
COMMENT ON COLUMN public.user_progress.letter_id IS 'Reference to letters table';
COMMENT ON COLUMN public.user_progress.status IS 'Current status: current (active) or completed';
COMMENT ON COLUMN public.user_progress.completed_at IS 'Timestamp when lesson was completed';
