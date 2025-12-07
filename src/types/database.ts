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
      Account: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Event: {
        Row: {
          createdAt: string
          description: string | null
          endDate: string | null
          id: string
          isCurrent: boolean
          name: string
          phase: Database["public"]["Enums"]["EventPhase"]
          prizesConfig: Json | null
          rubricConfig: Json | null
          slug: string
          startDate: string | null
          updatedAt: string
          year: number
        }
        Insert: {
          createdAt?: string
          description?: string | null
          endDate?: string | null
          id: string
          isCurrent?: boolean
          name: string
          phase?: Database["public"]["Enums"]["EventPhase"]
          prizesConfig?: Json | null
          rubricConfig?: Json | null
          slug: string
          startDate?: string | null
          updatedAt: string
          year: number
        }
        Update: {
          createdAt?: string
          description?: string | null
          endDate?: string | null
          id?: string
          isCurrent?: boolean
          name?: string
          phase?: Database["public"]["Enums"]["EventPhase"]
          prizesConfig?: Json | null
          rubricConfig?: Json | null
          slug?: string
          startDate?: string | null
          updatedAt?: string
          year?: number
        }
        Relationships: []
      }
      EventRegistration: {
        Row: {
          createdAt: string
          eventId: string
          id: string
          userId: string
        }
        Insert: {
          createdAt?: string
          eventId: string
          id: string
          userId: string
        }
        Update: {
          createdAt?: string
          eventId?: string
          id?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "EventRegistration_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventRegistration_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      JudgeScore: {
        Row: {
          comments: string | null
          createdAt: string
          id: string
          judgeId: string
          projectId: string
          scores: Json
          updatedAt: string
        }
        Insert: {
          comments?: string | null
          createdAt?: string
          id: string
          judgeId: string
          projectId: string
          scores: Json
          updatedAt: string
        }
        Update: {
          comments?: string | null
          createdAt?: string
          id?: string
          judgeId?: string
          projectId?: string
          scores?: Json
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "JudgeScore_judgeId_fkey"
            columns: ["judgeId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "JudgeScore_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          },
        ]
      }
      Milestone: {
        Row: {
          description: string | null
          endTime: string | null
          eventId: string
          id: string
          location: string | null
          phase: Database["public"]["Enums"]["EventPhase"]
          startTime: string
          title: string
        }
        Insert: {
          description?: string | null
          endTime?: string | null
          eventId: string
          id: string
          location?: string | null
          phase: Database["public"]["Enums"]["EventPhase"]
          startTime: string
          title: string
        }
        Update: {
          description?: string | null
          endTime?: string | null
          eventId?: string
          id?: string
          location?: string | null
          phase?: Database["public"]["Enums"]["EventPhase"]
          startTime?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "Milestone_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
        ]
      }
      Project: {
        Row: {
          createdAt: string
          demoUrl: string | null
          description: string
          id: string
          name: string
          repoUrl: string | null
          slideUrl: string | null
          submittedAt: string | null
          teamId: string
          updatedAt: string
          videoUrl: string | null
        }
        Insert: {
          createdAt?: string
          demoUrl?: string | null
          description: string
          id: string
          name: string
          repoUrl?: string | null
          slideUrl?: string | null
          submittedAt?: string | null
          teamId: string
          updatedAt: string
          videoUrl?: string | null
        }
        Update: {
          createdAt?: string
          demoUrl?: string | null
          description?: string
          id?: string
          name?: string
          repoUrl?: string | null
          slideUrl?: string | null
          submittedAt?: string | null
          teamId?: string
          updatedAt?: string
          videoUrl?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Project_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
        ]
      }
      Session: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Insert: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Team: {
        Row: {
          createdAt: string
          description: string | null
          emoji: string | null
          eventId: string
          id: string
          isAutoCreated: boolean
          isPublic: boolean
          lookingFor: string | null
          maxSize: number
          name: string
          slug: string | null
          trackSide: Database["public"]["Enums"]["TrackSide"]
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          emoji?: string | null
          eventId: string
          id: string
          isAutoCreated?: boolean
          isPublic?: boolean
          lookingFor?: string | null
          maxSize?: number
          name: string
          slug?: string | null
          trackSide: Database["public"]["Enums"]["TrackSide"]
          updatedAt: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          emoji?: string | null
          eventId?: string
          id?: string
          isAutoCreated?: boolean
          isPublic?: boolean
          lookingFor?: string | null
          maxSize?: number
          name?: string
          slug?: string | null
          trackSide?: Database["public"]["Enums"]["TrackSide"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Team_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
        ]
      }
      TeamMember: {
        Row: {
          createdAt: string
          id: string
          role: Database["public"]["Enums"]["MemberRole"]
          status: Database["public"]["Enums"]["MemberStatus"]
          teamId: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          role?: Database["public"]["Enums"]["MemberRole"]
          status?: Database["public"]["Enums"]["MemberStatus"]
          teamId: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          role?: Database["public"]["Enums"]["MemberRole"]
          status?: Database["public"]["Enums"]["MemberStatus"]
          teamId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "TeamMember_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TeamMember_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          autoAssignOptIn: boolean
          bio: string | null
          createdAt: string
          email: string | null
          emailVerified: string | null
          id: string
          image: string | null
          isFreeAgent: boolean
          lookingFor: string | null
          name: string | null
          role: Database["public"]["Enums"]["UserRole"]
          skills: string | null
          trackSide: Database["public"]["Enums"]["TrackSide"] | null
          updatedAt: string
        }
        Insert: {
          autoAssignOptIn?: boolean
          bio?: string | null
          createdAt?: string
          email?: string | null
          emailVerified?: string | null
          id: string
          image?: string | null
          isFreeAgent?: boolean
          lookingFor?: string | null
          name?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          skills?: string | null
          trackSide?: Database["public"]["Enums"]["TrackSide"] | null
          updatedAt: string
        }
        Update: {
          autoAssignOptIn?: boolean
          bio?: string | null
          createdAt?: string
          email?: string | null
          emailVerified?: string | null
          id?: string
          image?: string | null
          isFreeAgent?: boolean
          lookingFor?: string | null
          name?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          skills?: string | null
          trackSide?: Database["public"]["Enums"]["TrackSide"] | null
          updatedAt?: string
        }
        Relationships: []
      }
      VerificationToken: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
        }
        Relationships: []
      }
      Vote: {
        Row: {
          createdAt: string
          id: string
          projectId: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          projectId: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          projectId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Vote_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Vote_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
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
      EventPhase:
        | "SETUP"
        | "REGISTRATION"
        | "TEAM_FORMATION"
        | "HACKING"
        | "SUBMISSION"
        | "JUDGING"
        | "RESULTS"
      MemberRole: "OWNER" | "MEMBER"
      MemberStatus: "PENDING" | "ACCEPTED" | "REJECTED"
      TrackSide: "HUMAN" | "AI"
      UserRole: "USER" | "JUDGE" | "ADMIN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

