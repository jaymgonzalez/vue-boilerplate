// hooks/useAuth.ts
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'

interface Profile {
  user_id: string
  wallet_address: string
}

interface AuthData {
  user: any
  profile: Profile
}

export function useAuth() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !user) throw authError || new Error('No user found')

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('wallet_address')
        .eq('user_id', user.id)
        .single()

      if (profileError) throw profileError

      return { user, profile } as AuthData
    },
  })
}
