import { MergeStrategies } from './custom-webpack-builder-config';
import { smartStrategy } from 'webpack-merge';
import { Configuration } from 'webpack';
import { differenceWith, keyBy, merge } from 'lodash';

export function mergeConfigs(
  webpackConfig1: Configuration,
  webpackConfig2: Configuration,
  mergeStrategies: MergeStrategies = {},
  replacePlugins = false
): Configuration {
  const mergedConfig = smartStrategy(mergeStrategies)(webpackConfig1, webpackConfig2);
  if (webpackConfig1.plugins && webpackConfig2.plugins) {
    const conf1ExceptConf2 = differenceWith(
      webpackConfig1.plugins,
      webpackConfig2.plugins,
      (item1, item2) => item1.constructor.name === item2.constructor.name
    );
    if (!replacePlugins) {
      const conf1ByName = keyBy(webpackConfig1.plugins, 'constructor.name');
      webpackConfig2.plugins = webpackConfig2.plugins.map(p =>
        conf1ByName[p.constructor.name] ? merge(conf1ByName[p.constructor.name], p) : p
      );
    }
    mergedConfig.plugins = [...conf1ExceptConf2, ...webpackConfig2.plugins];
  }

  if (webpackConfig1.optimization.minimizer && webpackConfig2.optimization.minimizer) {
    const conf1ExceptConf2 = differenceWith(
      webpackConfig1.optimization.minimizer,
      webpackConfig2.optimization.minimizer,
      (item1, item2) => item1.constructor.name === item2.constructor.name
    );
    if (!replacePlugins) {
      const conf1ByName = keyBy(webpackConfig1.optimization.minimizer, 'constructor.name');
      webpackConfig2.optimization.minimizer = webpackConfig2.optimization.minimizer.map(p =>
        conf1ByName[p.constructor.name] ? merge(conf1ByName[p.constructor.name], p) : p
      );
    }

    mergedConfig.optimization.minimizer = [...conf1ExceptConf2, ...webpackConfig2.optimization.minimizer];
  }

  return mergedConfig;
}
