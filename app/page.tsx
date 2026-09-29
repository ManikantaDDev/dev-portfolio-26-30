// app/page.tsx
import { supabase } from '@/lib/supabase/client';

export default async function Home() {
  // 1. Attempt to fetch data from the 'projects' table
  const { data, error } = await supabase.from('projects').select('*');
  
  // 2. Check if there was an error
  if (error) {
    console.error('❌ Database connection failed:', error.message);
  } else {
    console.log('✅ Database connection successful! Fetched data:', data);
  }

  // 3. Display a simple message on the webpage
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Phase 2: Database Connection Test</h1>
      <p>Please look at your Command Prompt (Terminal) to see the result.</p>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error.message}</p>
      ) : (
        <p style={{ color: 'green' }}>Success! Connected to the database.</p>
      )}
    </main>
  );
}