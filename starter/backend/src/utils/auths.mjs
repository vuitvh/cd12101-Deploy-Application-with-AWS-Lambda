import { decode } from 'jsonwebtoken'

export const parseUserId = (jwtToken) => {
  const decodedJwt = decode(jwtToken)
  return decodedJwt.sub
}
