import { Buffer } from "buffer"

export interface CosmosCoinResult {
  denom: string
  amount: string
}

export interface CosmosAccountResult {
  address?: string
  coins: Array<CosmosCoinResult>
  public_key?: string
  account_number: string
  sequence: string
}

export interface CosmosValidator {
  operator_address: string
  consensus_pubkey: string
  jailed: boolean
  status: number
  tokens: string
  delegator_shares: string
  description: {
    moniker: string
    identity: string
    website: string
    details: string
  }
  unbonding_height: string
  unbonding_time: string
  commission: {
    commission_rates: {
      rate: string
      max_rate: string
      max_change_rate: string
    }
    update_time: string
  }
  min_self_delegation: string
}

export interface CosmosSendResult {
  hash: string
  sequence: any
  included: () => Promise<any>
}

export interface CosmosSignature {
  signature: Buffer
  publicKey: Buffer
}

export interface CosmosMessage {
  message: any
  simulate: ({ memo }: {
    memo?: any
  }) => Promise<number>
  send: (
    meta: {
      gas: any
      gasPrices?: any
      memo?: any
    },
    signer: (
      signMessage: string,
    ) => CosmosSignature
  ) => Promise<CosmosSendResult>
}
