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
      achievements: {
        Row: {
          badge_image_url: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          title: string
          xp_required: number
        }
        Insert: {
          badge_image_url?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          title: string
          xp_required: number
        }
        Update: {
          badge_image_url?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          title?: string
          xp_required?: number
        }
        Relationships: []
      }
      assessment_responses: {
        Row: {
          assessment_type: string
          completed_at: string | null
          id: string
          responses: Json
          score: Json | null
          user_id: string
        }
        Insert: {
          assessment_type: string
          completed_at?: string | null
          id?: string
          responses: Json
          score?: Json | null
          user_id: string
        }
        Update: {
          assessment_type?: string
          completed_at?: string | null
          id?: string
          responses?: Json
          score?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_modules: {
        Row: {
          content: Json
          created_at: string | null
          description: string | null
          difficulty_level: Database["public"]["Enums"]["difficulty_level"]
          estimated_duration: number | null
          id: string
          module_type: Database["public"]["Enums"]["module_type"]
          title: string
          xp_reward: number | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          description?: string | null
          difficulty_level: Database["public"]["Enums"]["difficulty_level"]
          estimated_duration?: number | null
          id?: string
          module_type: Database["public"]["Enums"]["module_type"]
          title: string
          xp_reward?: number | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          description?: string | null
          difficulty_level?: Database["public"]["Enums"]["difficulty_level"]
          estimated_duration?: number | null
          id?: string
          module_type?: Database["public"]["Enums"]["module_type"]
          title?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      learning_profiles: {
        Row: {
          assessment_score: Json
          cognitive_metrics: Json | null
          created_at: string | null
          id: string
          preferences: Json | null
          profile_type: Database["public"]["Enums"]["learning_profile_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assessment_score: Json
          cognitive_metrics?: Json | null
          created_at?: string | null
          id?: string
          preferences?: Json | null
          profile_type: Database["public"]["Enums"]["learning_profile_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assessment_score?: Json
          cognitive_metrics?: Json | null
          created_at?: string | null
          id?: string
          preferences?: Json | null
          profile_type?: Database["public"]["Enums"]["learning_profile_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          attempts: number | null
          completed_at: string | null
          created_at: string | null
          id: string
          last_accessed: string | null
          module_id: string
          performance_metrics: Json | null
          progress_percentage: number | null
          status: string | null
          time_spent: number | null
          user_id: string
        }
        Insert: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          module_id: string
          performance_metrics?: Json | null
          progress_percentage?: number | null
          status?: string | null
          time_spent?: number | null
          user_id: string
        }
        Update: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          module_id?: string
          performance_metrics?: Json | null
          progress_percentage?: number | null
          status?: string | null
          time_spent?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_activity_date: string | null
          level: number | null
          longest_streak: number | null
          modules_completed: number | null
          total_time_spent: number | null
          total_xp: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          level?: number | null
          longest_streak?: number | null
          modules_completed?: number | null
          total_time_spent?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          level?: number | null
          longest_streak?: number | null
          modules_completed?: number | null
          total_time_spent?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      difficulty_level: "beginner" | "intermediate" | "advanced"
      learning_profile_type:
        | "adhd"
        | "dyslexia"
        | "autism"
        | "mixed"
        | "neurotypical"
      module_type:
        | "reading"
        | "math"
        | "science"
        | "language"
        | "social_skills"
        | "executive_function"
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
    Enums: {
      difficulty_level: ["beginner", "intermediate", "advanced"],
      learning_profile_type: [
        "adhd",
        "dyslexia",
        "autism",
        "mixed",
        "neurotypical",
      ],
      module_type: [
        "reading",
        "math",
        "science",
        "language",
        "social_skills",
        "executive_function",
      ],
    },
  },
} as const
