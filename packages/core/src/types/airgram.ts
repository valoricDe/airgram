import * as api from './api'
import { ApiMethods } from './api-methods'
import { MiddlewareOn } from './api-middleware'

type PropType<T, PropT extends keyof T> = T[PropT]
type Predicate<T extends BaseTdObject> = PropType<NonNullable<T>, '_'>
type ClassType<T> = new (...args: unknown[]) => T

export type ErrorHandler = (error: Error, ctx?: Record<string, any>) => unknown

export type TdLibConfig = Omit<api.TdlibParametersInput, '_'>

export type PlainObjectToModelTransformer = (plainObject: TdObject) => ClassType<TdObject> | TdObject

export type MiddlewareFn<ContextT> = (ctx: ContextT, next: () => Promise<any>) => any
export type Middleware<ContextT> = { middleware: () => MiddlewareFn<ContextT> } | MiddlewareFn<ContextT>

export interface Deferred {
  promise: Promise<void>
  resolve: () => unknown
  reject: (error: Error) => unknown
}

export interface Composer<ContextT> {
  middleware (): MiddlewareFn<ContextT>

  on (predicateTypes: string | string[], ...fns: Middleware<ContextT>[]): void

  use (...fns: Middleware<ContextT>[]): void
}

export interface Config<ContextT, ProviderT extends TdProvider = TdProvider> extends TdLibConfig {
  provider: ProviderT
  context?: ContextT | ((ctx: Context<{}>) => ContextT)
  models?: PlainObjectToModelTransformer
  databaseEncryptionKey?: string
  logVerbosityLevel?: number
  name?: string
  token?: string
}

export interface Instance<ContextT = {}, ProviderT extends TdProvider = TdProvider> {
  readonly api: ApiMethods<ContextT>
  readonly config: Config<ContextT>
  readonly provider: ProviderT
  readonly name: string
  handleError: ErrorHandler

  readonly on: MiddlewareOn<ContextT>

  catch (handler: (error: Error) => void): void

  emit (update: TdObject): Promise<unknown>

  use (
    ...fns: Middleware<(ApiResponse<unknown, TdObject> | UpdateContext<TdObject>) & ContextT>[]
  ): void
}

export interface ApiRequest<ParamsT = unknown> {
  method: string
  params?: ParamsT
}

export interface ApiRequestOptions {
  state?: Record<string, unknown>
}

export interface ApiResponse<ParamsT, ResultT extends BaseTdObject> extends ContextState {
  _: Predicate<ResultT> | 'error'
  request: ApiRequest<ParamsT>
  response: ResultT | api.ErrorUnion
  airgram: Instance
}

export interface TdProvider {
  initialize (
    handleUpdate: (update: TdObject) => Promise<unknown>,
    handleError: (error: Error | string) => void,
    models?: PlainObjectToModelTransformer
  ): void

  send (request: ApiRequest): Promise<TdObject>
}

export interface BaseTdObject {
  _: string
}

// export interface TdObject extends BaseTdObject {
//   [key: string]: any
// }

export interface TdObject extends BaseTdObject {
  [key: string]: TdObject
    | TdObject[]
    | number
    | number[]
    | string
    | string[]
    | boolean
    | boolean[]
    | undefined
}

export type SetStateFn = (nextState: Record<string, unknown>) => void;
export type GetStateFn = () => Record<string, unknown>;

export interface ContextState {
  setState: SetStateFn
  getState: GetStateFn
}

export interface UpdateContext<UpdateT extends BaseTdObject> extends ContextState {
  _: Predicate<UpdateT>
  update: UpdateT
  airgram: Instance
}

export type Context<T = {}> = (ApiResponse<unknown, TdObject> | UpdateContext<TdObject>) & T
