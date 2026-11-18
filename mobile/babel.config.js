module.exports = function (api) {
  api.cache(true);
  const isProd =
    process.env.NODE_ENV === "production" ||
    process.env.BABEL_ENV === "production";
  const plugins = [];

  if (isProd) {
    plugins.push(["transform-remove-console", { exclude: ["error"] }]);
  }

  // react-native-reanimated/plugin her zaman en sonda yer almalıdır
  plugins.push("react-native-reanimated/plugin");

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins,
  };
};

