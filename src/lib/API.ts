import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
})

export async function findAll() {
  const { data } = await api.get('/todos')
  return data
}

export async function createOne() {
  const { data } = await api.post('/todos')
  return data
}
