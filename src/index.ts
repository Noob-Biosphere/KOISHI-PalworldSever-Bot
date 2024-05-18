import { Context, Schema } from 'koishi'

export const name = 'azimiao-palworld-server-tool'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  // write your plugin here
}
