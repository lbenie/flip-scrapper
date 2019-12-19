type URL = string

type ISO_8601_TIMESTAMP = string

interface Value {
  readonly id: string
  readonly display: string
  readonly count?: number
  readonly logo_url?: string
}

interface Data {
  readonly values: readonly Value[]
}

interface Filter {
  readonly type: string
  readonly key: string
  readonly title: string
  readonly data: Data
}

interface FilterResponse {
  readonly filters: readonly Filter[]
}

export interface ItemReponse {
  readonly flyer_item_id: number
  readonly flyer_id: number
  readonly left: number
  readonly right: number
  readonly bottom: number
  readonly top: number
  readonly clipping_image_url: URL
  readonly name: string
  readonly current_price: number
  readonly pre_price_text: string | null
  readonly post_price_text: string | null
  readonly sale_story: string | null
  readonly valid_to: ISO_8601_TIMESTAMP
  readonly valid_from: ISO_8601_TIMESTAMP
  readonly merchant_id: number
  readonly merchant_name: string
  readonly merchant_logo: URL
  readonly _L1: string
  readonly _L2: string
  readonly score: number
  readonly clean_image_url: URL
  readonly item_weight: number
  readonly premium: boolean
}

export type SortResponse = FilterResponse

export type FacetResponse = FilterResponse

export interface FlipResponse {
  readonly coupons: readonly unknown[]
  readonly merchants: readonly unknown[]
  readonly related_flyers: readonly unknown[]
  readonly outside_fsa_flyers: unknown
  readonly items: readonly ItemReponse[]
  readonly ecom_items: readonly unknown[]
  readonly related_items: readonly unknown[]
  readonly normalized_query: string
  readonly sort: SortResponse
  readonly facets: FacetResponse
}
