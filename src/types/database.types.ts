// Placeholder para tipos generados desde Supabase
// Generar con: supabase gen types typescript --local > src/types/database.types.ts

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
            roles: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    permissions: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    permissions?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    permissions?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            user_profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    role_id: string | null
                    department: string | null
                    position: string | null
                    avatar_url: string | null
                    preferences: Json
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    role_id?: string | null
                    department?: string | null
                    position?: string | null
                    avatar_url?: string | null
                    preferences?: Json
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    role_id?: string | null
                    department?: string | null
                    position?: string | null
                    avatar_url?: string | null
                    preferences?: Json
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            // Agregar más tablas según sea necesario
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            login: {
                Args: {
                    email: string
                    password: string
                }
                Returns: {
                    access_token: string
                    refresh_token: string | null
                    user: {
                        id: string
                        email: string
                        [key: string]: unknown
                    }
                }
            }
            register_tenant: {
                Args: {
                    email: string
                    password: string
                    full_name: string
                    company_name: string
                    company_cuit: string
                    company_fiscal_address: string
                    company_real_address: string
                    company_phone: string
                    company_responsable: string
                    company_vat_condition: string
                    company_employee_count: number
                }
                Returns: {
                    access_token: string
                    refresh_token: string | null
                    user_id: string
                    tenant_id: string
                }
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}
