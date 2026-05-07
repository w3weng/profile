import { useEffect, useState } from 'react'

type GithubProfile = {
  public_repos: number
  followers: number
}

export function useGithubProfile(username?: string) {
  const [data, setData] = useState<GithubProfile | null>(null)

  useEffect(() => {
    if (!username) return
    let cancelled = false
    fetch(`https://api.github.com/users/${username}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled || !json) return
        setData({ public_repos: json.public_repos ?? 0, followers: json.followers ?? 0 })
      })
      .catch(() => void 0)
    return () => {
      cancelled = true
    }
  }, [username])

  return data
}

