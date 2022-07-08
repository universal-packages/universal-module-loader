export type ModuleType = 'file' | 'index' | 'package'

export interface LoadModulesOptions {
  conventionPrefix?: string
  onlyDefault?: boolean
}

export interface ModuleRegistry {
  exports?: any
  error?: Error
  location: string
  type: ModuleType
}
