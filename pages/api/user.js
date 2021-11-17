import { API_URL } from '@/config/index'
// Use cookie dependancy to set cookie on the server side
import cookie from 'cookie'

export default async (req, res) => {
  if (req.method === 'GET') {
    //Check if jwt cookie exists
    if (!req.headers.cookie) {
      res.status(403).json({ message: 'Not Authorized' })
      return
    }

    // Get token from the cookie living in the server side
    const { token } = cookie.parse(req.headers.cookie)

    const strapiRes = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const user = await strapiRes.json()
    if (strapiRes.ok) {
      res.status(200).json({ user })
    } else {
      res.status(403).json({ message: 'User forbidden' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: `Method ${req.method} not allowed` })
  }
}
