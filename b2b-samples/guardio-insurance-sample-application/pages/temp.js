import { signOut } from 'next-auth/react'
import React from 'react'
import { Button } from 'rsuite'

export default function temp() {
  const signOutOnClick = () => signOut({ callbackUrl: "/" });

  return (
    <div>
        <Button onClick={signOutOnClick}>Sign out</Button>
    </div>
  )
}
