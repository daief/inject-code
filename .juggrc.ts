import { extendConfig } from '@axew/jugg';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const pkg = require('./package.json');

export default extendConfig({
  sourceMap: false,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  tsCustomTransformers: {
    before: [
      // [
      //   'ts-import-plugin',
      //   {
      //     libraryDirectory: 'lib',
      //     libraryName: 'antd',
      //     style: true,
      //   },
      // ],
      '@axew/jugg-plugin-react/lib/ts-rhl-transformer',
    ],
  },
  webpack: ({ config }) => {
    config.entryPoints.clear().end();

    ['background', 'options', 'popup'].forEach(name => {
      config
        .entry(name)
        .add(`./src/${name}`)
        .end()
        .plugin(`html-${name}`)
        .use(HtmlWebpackPlugin, [
          {
            template: `./src/documents/${name}.ejs`,
            filename: `${name}.html`,
            chunks: [name],
            inject: true,
          },
        ]);
    });

    config
      .plugin('copy')
      .use(CopyPlugin, [
        [
          { from: 'public' },
          {
            from: 'public/manifest.json',
            transform: function(content, path) {
              // generates the manifest file using the package.json informations
              return Buffer.from(
                JSON.stringify({
                  description: pkg.description,
                  version: pkg.version,
                  ...JSON.parse(content.toString()),
                }),
              );
            },
          },
        ],
      ])
      .end()
      .plugin('write-file')
      .use(WriteFilePlugin);

    return {
      devServer: {
        port: 4000,
      },
    };
  },
  html: false,
});
