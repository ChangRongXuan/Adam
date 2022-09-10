import axios from 'axios'
import CORS from 'cors'
import { number, object, string } from 'yup'
import Redis from 'ioredis'
import { CORS_ORIGINS, REDIS_HOST, REDIS_AUTH, REDIS_EX } from '../../config'
import globalAPICall from '../../utils/api/globalAPICall'
import { runMiddleware } from '../../utils/api/share'
import {
  URL_PROGRAMABLE_SEARCH,
  PROGRAMABLE_SEARCH_API_KEY,
  PROGRAMABLE_SEARCH_ENGINE_ID,
  API_TIMEOUT,
} from '../../config'

const cors = CORS({
  methods: ['HEAD', 'GET'],
  origin: CORS_ORIGINS,
})

const redis = new Redis({ host: REDIS_HOST, password: REDIS_AUTH })

export default async function handler(req, res) {
  await runMiddleware(req, res, cors)

  async function GET() {
    const result = await getSearchResult(req)

    if (typeof result === 'string') {
      res.status(400).json({ message: result })
    } else {
      res.status(200).json(result.data)
    }
  }

  await globalAPICall(req, res, { GET })
}

const searchQuerySchema = object({
  query: string().required(),
  start: number().optional().integer().positive().max(91),
  take: number().optional().integer().default(10).max(10).min(1),
})

async function getSearchResult(req) {
  try {
    const params = await searchQuerySchema.validate(req.query, {
      stripUnknown: true,
    })

    const queryParams = {
      key: PROGRAMABLE_SEARCH_API_KEY,
      cx: PROGRAMABLE_SEARCH_ENGINE_ID,
      q: params.query,
      start: params.start,
      num: params.take,
    }

    const prefix = 'PROGRAMABLE_SEARCH'
    const redisKey = `${prefix}_${queryParams.q}_${queryParams.start}_${queryParams.num}`
    const searchResultCache = await redis.get(redisKey)

    if (searchResultCache) {
      console.log(
        JSON.stringify({
          severity: 'DEBUG',
          message: `Get search result from redis cache with key ${redisKey}`,
        })
      )
      return { data: JSON.parse(searchResultCache) }
    } else {
      const response = await axios({
        method: 'get',
        url: `${URL_PROGRAMABLE_SEARCH}`,
        params: queryParams,
        timeout: API_TIMEOUT,
      })
      redis.set(redisKey, JSON.stringify(response.data), 'EX', REDIS_EX)
      return response
    }
  } catch (error) {
    console.log(JSON.stringify({ severity: 'ERROR', message: error.stack }))
    return error.message
  }
}