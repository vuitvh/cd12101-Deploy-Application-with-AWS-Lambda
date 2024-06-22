import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../../utils/utils.mjs'
import { updateTodo } from '../../services/todoServices.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const { todoId } = event.pathParameters
    const userId = getUserId(event)
    const item = await updateTodo(userId, todoId, JSON.parse(event.body))
    const resBody = { item }
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(resBody)
    }
  })
