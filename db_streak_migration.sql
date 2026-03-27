-- Login Streak Tracking System
-- Run this migration in your Supabase SQL Editor

-- Create login_streaks table
CREATE TABLE IF NOT EXISTS login_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_login_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create login_history for detailed tracking
CREATE TABLE IF NOT EXISTS login_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    login_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, login_date)
);

-- Enable Row Level Security
ALTER TABLE login_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own streaks" ON login_streaks;
DROP POLICY IF EXISTS "Users can update own streaks" ON login_streaks;
DROP POLICY IF EXISTS "Users can view own login history" ON login_history;
DROP POLICY IF EXISTS "Users can insert own login history" ON login_history;

-- Create policies for login_streaks
CREATE POLICY "Users can view own streaks" ON login_streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON login_streaks
    FOR ALL USING (auth.uid() = user_id);

-- Create policies for login_history
CREATE POLICY "Users can view own login history" ON login_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own login history" ON login_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_login_streaks_user_id ON login_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_date ON login_history(login_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for login_streaks
DROP TRIGGER IF EXISTS update_login_streaks_updated_at ON login_streaks;
CREATE TRIGGER update_login_streaks_updated_at
    BEFORE UPDATE ON login_streaks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
