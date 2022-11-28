import path from 'path'
import { traverse, DirectoryMap } from '@universal-packages/directory-traversal'
import { LoadModulesOptions, ModuleRegistry, ModuleType } from './loadModules.types'

/**
 *
 * Starts importing recursively until it finds a package, index file or just a file in that order
 *
 * If it finds a package.json it will just import the main file in the package
 *
 * If it find and index file it will just import that index file
 *
 * If any of above it will just import files deep in the hierarchy
 *
 **/
export async function loadModules(location: string, options?: LoadModulesOptions): Promise<ModuleRegistry[]> {
  const finalOptions: LoadModulesOptions = { onlyDefault: true, ...options }
  const fileFilterConventionPrefix = finalOptions.conventionPrefix ? `\\.(${finalOptions.conventionPrefix})` : ''
  const directoryMap = await traverse(location, { fileFilter: new RegExp(`^(.*)${fileFilterConventionPrefix}\.(ts|tsx|js|jsx|json)$`, 'g') })

  return await processDirectory(directoryMap, finalOptions)
}

/** Recursively try to find modules ina directory map to load*/
async function processDirectory(directory: DirectoryMap, options: LoadModulesOptions): Promise<ModuleRegistry[]> {
  const packageRegex = /package\.json$/g
  const indexRegex = /index\.(ts|tsx|js|jsx)$/g
  let modules: ModuleRegistry[] = []

  // First check if there is a package.json this way we know
  // we don't need to go any deeper all the hierarchy is a single module
  // and we don't care if we are executing TS or Node
  const packageLocation = directory.files.find((fileLocation: string): boolean => !!packageRegex.exec(fileLocation))

  if (packageLocation) {
    const packageJson = await import(packageLocation)

    // The package has a main directive indicating the core module location
    if (packageJson.main) {
      const packageLocationDirename = path.dirname(packageLocation)
      const mainModulePath = path.resolve(packageLocationDirename, packageJson.main)

      modules.push(await importAndRegister(mainModulePath, 'package', options))

      return modules
    }
  }

  // If no package.json we try to find an index file to consider it as an entry point
  const indexLocation = directory.files.find((fileLocation: string): boolean => !!indexRegex.exec(fileLocation))

  if (indexLocation) {
    modules.push(await importAndRegister(indexLocation, 'index', options))
    return modules
  }

  // If any of above we check file per file in the hierarchy for modules
  for (let i = 0; i < directory.files.length; i++) {
    const currentFile = directory.files[i]

    modules.push(await importAndRegister(currentFile, 'file', options))
  }

  // If not an index and package module was found we continue deeper
  for (let i = 0; i < directory.directories.length; i++) {
    const currentDirectory = directory.directories[i]

    modules = modules.concat(await processDirectory(currentDirectory, options))
  }

  return modules
}

/** Creates a registry in the current result packed with an error if any */
async function importAndRegister(location: string, type: ModuleType, options: LoadModulesOptions): Promise<ModuleRegistry> {
  try {
    const imported = await import(location)
    const exports = options.onlyDefault ? imported.default : imported

    return { location, exports, type }
  } catch (error) {
    return { location, error, type }
  }
}
