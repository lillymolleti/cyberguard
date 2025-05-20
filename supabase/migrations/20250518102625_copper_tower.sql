/*
  # Add auth trigger for profile creation
  
  1. Changes
    - Create trigger function to handle new user registration
    - Add trigger to create profile entries automatically
    
  2. Security
    - Maintains existing RLS policies
    - Ensures profile creation for all new users
*/

-- Create a secure trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();