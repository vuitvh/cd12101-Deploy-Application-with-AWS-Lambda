import { parseUserId } from './auths.mjs'

export const getUserId = (event) => {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}
