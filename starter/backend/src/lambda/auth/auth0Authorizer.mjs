import axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('lambda.auth.auth0Authorizer')

const jwksUrl =
  'https://dev-lgel4r7r7wmuif5z.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  try {
    const res = await axios.get(jwksUrl)
    const key = res?.data?.keys?.find((k) => k.kid === jwt.header.kid)
    if (!key) {
      throw new Error('Key not found')
    }
    const pem = key.x5c[0]
    const cert = `-----BEGIN CERTIFICATE-----\n${pem}\n-----END CERTIFICATE-----`

    return jsonwebtoken.verify(token, cert)
  } catch {
    logger.error('Verify token failed', { error })
  }

  return undefined
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
