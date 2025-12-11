export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string | null
          id: string
          prompt_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          prompt_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          prompt_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      generation_usage: {
        Row: {
          created_at: string
          framework: string | null
          generated_at: string
          id: string
          language: string | null
          prompt_type: string
          tokens_used: number | null
          tool: string
          user_id: string
        }
        Insert: {
          created_at?: string
          framework?: string | null
          generated_at?: string
          id?: string
          language?: string | null
          prompt_type: string
          tokens_used?: number | null
          tool: string
          user_id: string
        }
        Update: {
          created_at?: string
          framework?: string | null
          generated_at?: string
          id?: string
          language?: string | null
          prompt_type?: string
          tokens_used?: number | null
          tool?: string
          user_id?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean | null
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      prompts: {
        Row: {
          author_id: string | null
          button_text: string | null
          category: string | null
          content: string
          content_type: string | null
          created_at: string | null
          description: string
          difficulty_level: string | null
          favorites_count: number | null
          framework: string | null
          id: string
          is_featured: boolean | null
          is_trending: boolean | null
          language: string | null
          logo_url: string | null
          primary_tag: string | null
          slug: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          url: string | null
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          button_text?: string | null
          category?: string | null
          content: string
          content_type?: string | null
          created_at?: string | null
          description: string
          difficulty_level?: string | null
          favorites_count?: number | null
          framework?: string | null
          id?: string
          is_featured?: boolean | null
          is_trending?: boolean | null
          language?: string | null
          logo_url?: string | null
          primary_tag?: string | null
          slug?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          url?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          button_text?: string | null
          category?: string | null
          content?: string
          content_type?: string | null
          created_at?: string | null
          description?: string
          difficulty_level?: string | null
          favorites_count?: number | null
          framework?: string | null
          id?: string
          is_featured?: boolean | null
          is_trending?: boolean | null
          language?: string | null
          logo_url?: string | null
          primary_tag?: string | null
          slug?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          url?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      tool_updates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_major: boolean | null
          published_at: string
          source_url: string | null
          title: string
          tool_id: string
          update_type: string | null
          updated_at: string
          upvotes: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_major?: boolean | null
          published_at?: string
          source_url?: string | null
          title: string
          tool_id: string
          update_type?: string | null
          updated_at?: string
          upvotes?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_major?: boolean | null
          published_at?: string
          source_url?: string | null
          title?: string
          tool_id?: string
          update_type?: string | null
          updated_at?: string
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tool_updates_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      tools: {
        Row: {
          brand_color: string | null
          changelog_url: string | null
          created_at: string
          description: string | null
          id: string
          last_update_at: string | null
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
          updates_count: number | null
          website_url: string | null
        }
        Insert: {
          brand_color?: string | null
          changelog_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          last_update_at?: string | null
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
          updates_count?: number | null
          website_url?: string | null
        }
        Update: {
          brand_color?: string | null
          changelog_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          last_update_at?: string | null
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
          updates_count?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
      trending_items: {
        Row: {
          created_at: string | null
          id: string
          prompt_id: string | null
          trending_score: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          prompt_id?: string | null
          trending_score?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          prompt_id?: string | null
          trending_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trending_items_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_trending_score: { Args: never; Returns: undefined }
      generate_slug: { Args: { input_title: string }; Returns: string }
      increment_prompt_views: {
        Args: { prompt_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
