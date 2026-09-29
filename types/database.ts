 
// types/database.ts

// We define the shape of our database tables here.
// This ensures TypeScript knows exactly what data to expect.
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'viewer';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      portfolio_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['portfolio_settings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['portfolio_settings']['Insert']>;
      };
      sections_config: {
        Row: {
          id: string;
          name: string;
          is_visible: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sections_config']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['sections_config']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_url: string | null;
          live_url: string | null;
          github_url: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      // Note: We will add skills, experiences, etc., in Phase 9 to keep this file manageable for now.
    };
  };
};