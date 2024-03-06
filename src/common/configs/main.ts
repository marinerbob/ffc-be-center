import type { Config } from './types'

const config: Config = {
  swagger: {
    enabled: true,
    title: 'FFC-BE-CENTER',
    description: 'API хаба серверной части приложения',
    version: '0.1alpha',
    path: 'api',
  },
}

export default (): Config => config
