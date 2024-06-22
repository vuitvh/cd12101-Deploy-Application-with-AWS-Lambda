import * as uuid from 'uuid'
import {
  getTodosByUserId,
  createNewTodo,
  updateTodoById,
  deleteTodoById
} from '../repositories/todoRepository.mjs'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('lambda.services.todoServices')

export const getTodos = async (userId) => {
  logger.info(`Creating todo list for user ID ${userId}`)
  return getTodosByUserId(userId)
}

export const createTodo = async (userId, todo) => {
  const todoId = uuid.v4()
  logger.info(`Creating todo ${todoId}`)
  return createNewTodo({
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    ...todo
  })
}

export const updateTodo = async (userId, todoId, todo) => {
  logger.info(`Updating todo id ${todoId}`)
  return updateTodoById(userId, todoId, todo)
}

export const deleteTodo = async (userId, todoId) => {
  logger.info(`Deleting todo id ${todoId}`)
  return deleteTodoById(userId, todoId)
}
