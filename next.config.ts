const path = require('path');
import { Configuration } from 'webpack';

interface WebpackConfig extends Configuration {
  resolve: NonNullable<Configuration['resolve']>;
}

module.exports = {
  webpack: (config: WebpackConfig): WebpackConfig => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  }
};