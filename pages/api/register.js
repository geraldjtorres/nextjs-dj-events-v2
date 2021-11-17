import { API_URL } from '@/config/index'
// Use cookie dependancy to set cookie on the server side
import cookie from 'cookie'

export default async (req, res) => {
  if (req.method === 'POST') {
    const { username, email, password } = req.body

    const strapiRes = await fetch(`${API_URL}/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    })

    const data = await strapiRes.json()
    console.log(data.jwt)
    if (strapiRes.ok) {
      // Set Cookie on the server side
      // More secure like this
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', data.jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          sameSite: 'strict',
          path: '/' // Cookie will be accessable in all paths
        })
      )

      //Return user data to auth context
      res.status(200).json({ user: data.user })
    } else {
      res
        .status(data.statusCode)
        .json({ message: data.message[0].messages[0].message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ message: `Method ${req.method} not allowed` })
  }
}
