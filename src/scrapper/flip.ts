import axios from 'axios'
import { ResultSet } from '../models/resultSet'
import { FlipResponse } from '../models/flip'
import { from, EMPTY, timer } from 'rxjs'
import { mergeMap, scan, tap, catchError } from 'rxjs/operators'
import { format } from 'date-fns'
import { terms } from './search.json'
import { writeFileSync } from 'fs'
import { join } from 'path'

class FlipScrapper {
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
      mergeMap(() => from(terms)),
      mergeMap(
        async query =>
          ({
            query,
            ...(await this.getItems(query, postalCode, locale)),
          } as ResultSet),
      ),
      scan((acc, value) => [...acc, { ...value }], [] as ResultSet[]),
      tap(results => {
        // Should write in a database but this is fine for now
        const now = Date.now()

        const resultObj = {
          parsedDate: format(now, `yyyy-MM-dd'T'HH:mm:ss`),
          results,
        }
        writeFileSync(
          join(
            __dirname,
            '..',
            'data',
            `${format(now, 'dd-MM-yyyy')}-data.json`,
          ),
          JSON.stringify(resultObj, null, 4),
          'utf-8',
        )
      }),
      catchError(err => {
        console.error(err)
        return EMPTY
      }),
    )
  }
}

export default new FlipScrapper()
