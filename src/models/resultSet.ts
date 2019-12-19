import { FlipResponse } from './flip'

export interface ResultSet extends FlipResponse {
  readonly query: string
}
