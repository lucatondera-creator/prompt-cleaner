export type Draft = string

declare module 'claude-code' {
  interface PluginState {
    'prompt-aufraeumer': { isLong: boolean; isBusy: boolean; backup: string | null }
  }
}
