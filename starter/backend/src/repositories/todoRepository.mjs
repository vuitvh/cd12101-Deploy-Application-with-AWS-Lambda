import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('lambda.repositories.todoRepository')
const dynamoDbClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: 'us-east-1' })
)
const todosTable = process.env.TODOS_TABLE

export const getTodosByUserId = async (userId) => {
  logger.info('Getting list of todo items by user id from the Todos table')

  const getTodosCommand = new QueryCommand({
    TableName: todosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  })
  const result = await dynamoDbClient.send(getTodosCommand)
  return result.Items
}

export const createNewTodo = async (newTodo) => {
  logger.info(`Creating new todo item: ${newTodo.todoId} on the Todos table`)
  const createCommand = new PutCommand({
    TableName: todosTable,
    Item: newTodo
  })
  await dynamoDbClient.send(createCommand)
  return newTodo
}

export const updateTodoById = async (userId, todoId, updateData) => {
  logger.info(`Updating an existing todo id: ${todoId} on the Todos table`)
  const updateCommand = new UpdateCommand({
    TableName: todosTable,
    Key: { userId, todoId },
    ConditionExpression: 'attribute_exists(todoId)',
    UpdateExpression: 'set #n = :name, dueDate = :dueDate, done = :done',
    ExpressionAttributeNames: { '#n': 'name' },
    ExpressionAttributeValues: {
      ':name': updateData.name,
      ':dueDate': updateData.dueDate,
      ':done': updateData.done
    }
  })
  await dynamoDbClient.send(updateCommand)
}

export const deleteTodoById = async (userId, todoId) => {
  logger.info(`Deleting an existing todo id: ${todoId} on the Todos table`)
  const deleteCommand = new DeleteCommand({
    TableName: todosTable,
    Key: { userId, todoId }
  })
  await dynamoDbClient.send(deleteCommand)
}

// export const saveImgUrl = async (userId, todoId, bucketName) => {
//   try {
//     const command = new UpdateCommand({
//       TableName: todosTable,
//       Key: { userId, todoId },
//       ConditionExpression: 'attribute_exists(todoId)',
//       UpdateExpression: 'set attachmentUrl = :attachmentUrl',
//       ExpressionAttributeValues: {
//         ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${todoId}`
//       }
//     })
//     logger.info(
//       `Updating image url for a todo item: https://${bucketName}.s3.amazonaws.com/${todoId}`
//     )
//     await docClient.send(command)
//   } catch (error) {
//     logger.error(error)
//   }
// }
