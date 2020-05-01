module.exports = {
  mode: "production",
  entry: {
    app: "./functions/src/index.ts",
  },
  output: {
    filename: "index.js",
    path: "/functions/lib",
  },
  resolve: {
    modules: ["node_modules", "/functions/node_modules"],
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx"],
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
    ],
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  //   externals: {
  // react: "React",
  // "react-dom": "ReactDOM",
  //   },
  externals: {
    "body-parser": "bodyParser",
    express: "express",
    "firebase-functions": "functions",
    "firebase-functions-helper": "firebaseHelper",
    "firebase-admin": "admin",
    cors: "cors",
  },
};
