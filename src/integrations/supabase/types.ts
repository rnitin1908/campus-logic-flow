export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admission_documents: {
        Row: {
          admission_id: string
          id: string
          name: string
          type: string
          uploaded_at: string | null
          url: string
        }
        Insert: {
          admission_id: string
          id?: string
          name: string
          type: string
          uploaded_at?: string | null
          url: string
        }
        Update: {
          admission_id?: string
          id?: string
          name?: string
          type?: string
          uploaded_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "admission_documents_admission_id_fkey"
            columns: ["admission_id"]
            isOneToOne: false
            referencedRelation: "admission_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      admission_requests: {
        Row: {
          academic_year: string
          address: string | null
          contact_number: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          grade_applying_for: string
          id: string
          notes: string | null
          parent_id: string
          previous_school: string | null
          school_id: string | null
          status: Database["public"]["Enums"]["admission_status"]
          student_name: string
          updated_at: string | null
        }
        Insert: {
          academic_year: string
          address?: string | null
          contact_number?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          grade_applying_for: string
          id?: string
          notes?: string | null
          parent_id: string
          previous_school?: string | null
          school_id?: string | null
          status?: Database["public"]["Enums"]["admission_status"]
          student_name: string
          updated_at?: string | null
        }
        Update: {
          academic_year?: string
          address?: string | null
          contact_number?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          grade_applying_for?: string
          id?: string
          notes?: string | null
          parent_id?: string
          previous_school?: string | null
          school_id?: string | null
          status?: Database["public"]["Enums"]["admission_status"]
          student_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admission_requests_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      allergies: {
        Row: {
          created_at: string | null
          health_info_id: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          health_info_id?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          health_info_id?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "allergies_health_info_id_fkey"
            columns: ["health_info_id"]
            isOneToOne: false
            referencedRelation: "health_info"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          id: string
          name: string
          student_id: string | null
          type: string
          updated_at: string | null
          upload_date: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          student_id?: string | null
          type: string
          updated_at?: string | null
          upload_date?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          student_id?: string | null
          type?: string
          updated_at?: string | null
          upload_date?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_contacts: {
        Row: {
          created_at: string | null
          id: string
          name: string
          phone: string
          relation: string | null
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          phone: string
          relation?: string | null
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          phone?: string
          relation?: string | null
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      health_info: {
        Row: {
          blood_group: string | null
          created_at: string | null
          id: string
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          blood_group?: string | null
          created_at?: string | null
          id?: string
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          blood_group?: string | null
          created_at?: string | null
          id?: string
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_info_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_conditions: {
        Row: {
          created_at: string | null
          health_info_id: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          health_info_id?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          health_info_id?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_conditions_health_info_id_fkey"
            columns: ["health_info_id"]
            isOneToOne: false
            referencedRelation: "health_info"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_info: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          relation: string | null
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          relation?: string | null
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          relation?: string | null
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_info_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"] | null
          school_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["user_role"] | null
          school_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          school_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          contact_number: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_number?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_number?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          address: string | null
          contact_number: string | null
          created_at: string | null
          date_of_birth: string | null
          department: string
          email: string
          employee_id: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          joining_date: string | null
          name: string
          position: string
          profile_id: string | null
          qualification: string | null
          status: Database["public"]["Enums"]["status_type"] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_number?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          department: string
          email: string
          employee_id: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          joining_date?: string | null
          name: string
          position: string
          profile_id?: string | null
          qualification?: string | null
          status?: Database["public"]["Enums"]["status_type"] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_number?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          department?: string
          email?: string
          employee_id?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          joining_date?: string | null
          name?: string
          position?: string
          profile_id?: string | null
          qualification?: string | null
          status?: Database["public"]["Enums"]["status_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          academic_year: string | null
          address: string | null
          admission_date: string | null
          class: string | null
          contact_number: string | null
          created_at: string | null
          date_of_birth: string | null
          department: string
          email: string
          enrollment_date: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          name: string
          previous_school: string | null
          profile_id: string | null
          roll_number: string
          section: string | null
          status: Database["public"]["Enums"]["status_type"] | null
          updated_at: string | null
        }
        Insert: {
          academic_year?: string | null
          address?: string | null
          admission_date?: string | null
          class?: string | null
          contact_number?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          department: string
          email: string
          enrollment_date?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          name: string
          previous_school?: string | null
          profile_id?: string | null
          roll_number: string
          section?: string | null
          status?: Database["public"]["Enums"]["status_type"] | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: string | null
          address?: string | null
          admission_date?: string | null
          class?: string | null
          contact_number?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          department?: string
          email?: string
          enrollment_date?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          name?: string
          previous_school?: string | null
          profile_id?: string | null
          roll_number?: string
          section?: string | null
          status?: Database["public"]["Enums"]["status_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
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
      admission_status:
        | "pending"
        | "reviewing"
        | "approved"
        | "rejected"
        | "waitlisted"
      gender_type: "male" | "female" | "other"
      status_type:
        | "active"
        | "inactive"
        | "on leave"
        | "terminated"
        | "graduated"
        | "suspended"
        | "pending"
      user_role:
        | "super_admin"
        | "school_admin"
        | "teacher"
        | "student"
        | "parent"
        | "accountant"
        | "librarian"
        | "receptionist"
        | "transport_manager"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admission_status: [
        "pending",
        "reviewing",
        "approved",
        "rejected",
        "waitlisted",
      ],
      gender_type: ["male", "female", "other"],
      status_type: [
        "active",
        "inactive",
        "on leave",
        "terminated",
        "graduated",
        "suspended",
        "pending",
      ],
      user_role: [
        "super_admin",
        "school_admin",
        "teacher",
        "student",
        "parent",
        "accountant",
        "librarian",
        "receptionist",
        "transport_manager",
      ],
    },
  },
} as const
