import { API_URL } from '@/config/index'
// Use cookie dependancy to set cookie on the server side
import cookie from 'cookie'

export default async (req, res) => {
  if (req.method === 'POST') {
    // Destroy Cookie
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        expires: new Date(0),
        sameSite: 'strict',
        path: '/' // Cookie will be accessable in all paths
      })
    )
    res.status(200).json({ message: 'Logout Success' })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ message: `Method ${req.method} not allowed` })
  }
}
