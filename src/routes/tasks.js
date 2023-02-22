import { randomUUID } from 'node:crypto'
import { Database } from '../database.js'
import { buildRoutePath } from '../utils/build-route-path.js'

const database = new Database()

const resource = 'tasks'

export const tasksTasks = [
  {
    method: 'GET',
    path: buildRoutePath(`/${resource}`),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select(
        resource,
        search
          ? {
              title: search,
              description: search,
            }
          : null,
      )

      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: 'POST',
    path: buildRoutePath(`/${resource}`),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      database.insert(resource, task)

      return res.writeHead(201).end()
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath(`/${resource}/:id`),
    handler: (req, res) => {
      const { id } = req.params

      const tasks = database.select(resource, null)
      const taskInDatabase = tasks.find((task) => task.id === id)

      if (!taskInDatabase) return res.writeHead(404).end()

      const { title, description } = req.body
      const data = {
        ...taskInDatabase,
        updated_at: new Date(),
      }
      if (title) data.title = title
      if (description) data.description = description

      database.update(resource, id, data)

      return res.writeHead(204).end()
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath(`/${resource}/:id/complete`),
    handler: (req, res) => {
      const { id } = req.params

      const tasks = database.select(resource, null)
      const taskInDatabase = tasks.find((task) => task.id === id)

      if (!taskInDatabase) return res.writeHead(404).end()

      const data = {
        ...taskInDatabase,
        completed_at: taskInDatabase.completed_at ? null : new Date(),
        updated_at: new Date(),
      }

      database.update(resource, id, data)

      return res.writeHead(204).end()
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath(`/${resource}/:id`),
    handler: (req, res) => {
      const { id } = req.params

      database.delete(resource, id)

      return res.writeHead(204).end()
    },
  },
]
