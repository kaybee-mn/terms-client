import { useEffect, useState, ReactNode } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { Session } from '@supabase/supabase-js'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabase from '../api/supabaseClient'


type Props = {
  children: ReactNode
}

export default function AuthWrapper({ children }: Props) {
  const [session, setSession] = useState<Session|null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Auth supabaseClient={supabase}  appearance={{theme:ThemeSupa}}/>
      </div>
    )
  }

  return <>{children}</>
}
