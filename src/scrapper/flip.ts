import axios from 'axios'
import { ResultSet } from '../models/resultSet'
import { FlipResponse } from '../models/flip'
import { from, EMPTY, timer } from 'rxjs'
import { mergeMap, scan, tap, catchError } from 'rxjs/operators'
import { stores } from './search.json'
import { getConnection } from '../data/database'
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config()

class FlipScrapper {
  private client?: MongoClient

  private async getItems(
    query: string,
    postalCode = 'G1G2A1',
    locale = 'fr-ca',
  ) {
    const { data } = await axios.get<FlipResponse>(
      `https://backflipp.wishabi.com/flipp/items/search`,
      {
        params: {
          locale,
          // eslint-disable-next-line @typescript-eslint/camelcase
          postal_code: postalCode,
          q: query,
        },
      },
    )

    return data
  }

  run(postalCode = 'G1G2A1', locale = 'fr-ca') {
    const oneWeek = 1000 * 60 * 60 * 24 * 7

    return timer(0, oneWeek).pipe(
      mergeMap(() => from(stores)),
      mergeMap(
        async query =>
          ({
            query,
            ...(await this.getItems(query, postalCode, locale)),
          } as ResultSet),
      ),
      scan((acc, value) => [...acc, { ...value }], [] as ResultSet[]),
      tap(async results => {
        this.client = await getConnection()
        const db = this.client?.db(process.env.MONGO_DATABASE)
        const itemCollection = db.collection(
          process.env.MONGO_DATABASE_COLLECTION_ITEMS,
        )

        results.forEach(async ({ items, query }) => {
          await itemCollection.insertMany(
            items.map(item => ({ ...item, query })),
          )
        })
      }),
      catchError(err => {
        console.error(err)
        return EMPTY
      }),
    )
  }

  async close() {
    await this.client?.close()
  }
}

export default new FlipScrapper()
