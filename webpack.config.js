const webpack = require("webpack");
const devConf = require("@widget-lab/widget-templates-webpack-configs/webpack.config.dev");
const devS3Conf = require("@widget-lab/widget-templates-webpack-configs/webpack.config.dev-s3");
const prodConf = require("@widget-lab/widget-templates-webpack-configs/webpack.config.prod");
const { VueLoaderPlugin } = require("vue-loader");
const { VuetifyPlugin } = require("webpack-plugin-vuetify");
const { merge } = require("webpack-merge");
const path = require("path");
const dotenv = require("dotenv");

const vueConf = {
    module: {
        rules: [{ test: /\.vue$/, loader: "vue-loader" }]
    },
    plugins: [new VueLoaderPlugin()]
};

const vuetifyConf = {
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader"
                ]
            }
        ]
    },
    plugins: [new VuetifyPlugin()]
};

/**
 * use this object to override our settings
 */
const myConf = {
  entry: "./src/main.js",
  resolve: {
    extensions: [".js", ".vue", ".json", ".mjs"],
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/,
        type: 'asset/resource',
      },
    ],
  },
  devServer: {
    port: 8083
  }
};

// 🔧 Environment-aware plugin setup
function getEnvPluginConfig(env = {}) {
  const currentEnv = env.NODE_ENV || process.env.NODE_ENV || "development";
  const envFile = `.env.${currentEnv}`;
 
  const envConfig = dotenv.config({ path: path.resolve(__dirname, envFile) }).parsed || {};
 
  return {
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(currentEnv),
        "process.env.VUE_APP_BASE_URL": JSON.stringify(envConfig.VUE_APP_BASE_URL || "")
      })
    ]
  };
}
// Export all configs
module.exports = (env = {}) => [
  {
    name: "dev",
    ...merge(devConf, vueConf, vuetifyConf, myConf, getEnvPluginConfig({ NODE_ENV: "development" }))
  },
  {
    name: "devS3",
    ...merge(devS3Conf, vueConf, vuetifyConf, myConf, getEnvPluginConfig({ NODE_ENV: "development" }))
  },
  {
    name: "prod",
    ...merge(prodConf, vueConf, vuetifyConf, myConf, getEnvPluginConfig({ NODE_ENV: "production" }))
  }
];
 
