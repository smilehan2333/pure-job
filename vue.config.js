module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        src: "@",
        assets: "@/assets",
        common: "@/common",
        components: "@/components",
        api: "@/api",
        views: "@/views",
        plugins: "@/plugins"
      }
    }
  }
};
