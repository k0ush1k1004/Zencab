// src/utils/loadMappls.ts
export const loadMappls = (key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.mappls && window.mappls.Map) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://apis.mappls.com/advancedmaps/api/${key}/map_sdk_plugins?v=3.0&layer=vector`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject("Mappls SDK failed to load");
    document.body.appendChild(script);
  });
};
