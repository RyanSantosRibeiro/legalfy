export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      processes: {
        Row: {
          id: string
          process_key: string
          title: string
          description: string | null
          process_type: string
          status: string
          lawyer_id: string
          client_id: string | null
          client_name: string | null
          client_email: string | null
          client_phone: string | null
          court: string | null
          case_number: string | null
          judge: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          process_key: string
          title: string
          description?: string | null
          process_type: string
          status: string
          lawyer_id: string
          client_id?: string | null
          client_name?: string | null
          client_email?: string | null
          client_phone?: string | null
          court?: string | null
          case_number?: string | null
          judge?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          process_key?: string
          title?: string
          description?: string | null
          process_type?: string
          status?: string
          lawyer_id?: string
          client_id?: string | null
          client_name?: string | null
          client_email?: string | null
          client_phone?: string | null
          court?: string | null
          case_number?: string | null
          judge?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      process_documents: {
        Row: {
          id: string
          process_id: string
          name: string
          file_path: string
          file_type: string
          file_size: number
          uploaded_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          process_id: string
          name: string
          file_path: string
          file_type: string
          file_size: number
          uploaded_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          process_id?: string
          name?: string
          file_path?: string
          file_type?: string
          file_size?: number
          uploaded_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      process_questionnaires: {
        Row: {
          id: string
          process_id: string
          data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          process_id: string
          data: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          process_id?: string
          data?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
