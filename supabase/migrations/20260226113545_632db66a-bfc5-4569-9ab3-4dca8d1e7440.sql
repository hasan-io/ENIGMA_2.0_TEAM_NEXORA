
CREATE TABLE public.mentor_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic_name TEXT NOT NULL,
  question TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mentor_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mentor interactions"
  ON public.mentor_interactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mentor interactions"
  ON public.mentor_interactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
