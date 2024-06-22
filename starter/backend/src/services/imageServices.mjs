import { createLogger } from '../utils/logger.mjs'
import { attachImgUrlById } from '../repositories/todoRepository.mjs'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const logger = createLogger('lambda.services.imageServices')
const bucketName = process.env.S3_BUCKET
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)
const s3Client = new S3Client({ region: 'us-east-1' })

export const attachImgUrl = async (userId, todoId) => {
  const command = new PutObjectCommand({ Bucket: bucketName, Key: todoId })
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })

  logger.info('Generating image URL:', {
    todoId,
    bucketName
  })

  await attachImgUrlById(userId, todoId, bucketName)

  return signedUrl
}
