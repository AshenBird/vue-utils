// 本地存储绑定插件
export default function bindStoragePluginCreate({
  modules,
  getter: get,
  setter: set
}) {
  return store => {
    for (const [name, module] of Object.entries(modules)) {
      const keys = Object.keys(module.state);
      keys.forEach(async k => {
        const value = await get(k);
        if (typeof value !== "boolean" && !value) {
          await set(k, module.state[k]);
        } else {
          module.state[k] = value;
        }
      });
      store.registerModule(name, module);
      keys.forEach(k => {
        store.watch(
          state => {
            return state[name][k];
          },
          n => {
            set(k, n);
          },
          {}
        );
      });
    }
  };
}
