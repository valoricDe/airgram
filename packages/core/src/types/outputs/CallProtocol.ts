export type CallProtocolUnion = CallProtocol

/** Specifies the supported call protocols */
export interface CallProtocol {
  _: 'callProtocol'
  /** True, if UDP peer-to-peer connections are supported */
  udpP2P: boolean
  /** True, if connection through UDP reflectors is supported */
  udpReflector: boolean
  /** Minimum supported API layer; use 65 */
  minLayer: number
  /** Maximum supported API layer; use 65 */
  maxLayer: number
}
