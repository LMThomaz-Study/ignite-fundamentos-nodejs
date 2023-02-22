import { randomUUID } from 'node:crypto'
import { Database } from '../database.js'
import { buildRoutePath } from '../utils/build-route-path.js'

const database = new Database()

const resource = 'users'

export const routesUsers = [
  {
    method: 'GET',
    path: buildRoutePath(`/${resource}`),
    handler: (req, res) => {
      const { search } = req.query

      const users = database.select(
        resource,
        search
          ? {
              name: search,
              email: search,
            }
          : null,
      )

      return res.end(JSON.stringify(users))
    },
  },
  {
    method: 'POST',
    path: buildRoutePath(`/${resource}`),
    handler: (req, res) => {
      const { name, email } = req.body

      const user = {
        id: randomUUID(),
        name,
        email,
      }

      database.insert(resource, user)

      return res.writeHead(201).end()
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath(`/${resource}/:id`),
    handler: (req, res) => {
      const { id } = req.params
      const { name, email } = req.body

      database.update(resource, id, { name, email })

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
