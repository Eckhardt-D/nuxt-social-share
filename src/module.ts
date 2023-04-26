import {
  defineNuxtModule,
  // addPlugin,
  createResolver,
  addComponent,
} from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-social-share",
    configKey: "socialShare",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(/* options, nuxt */) {
    const { resolve } = createResolver(import.meta.url);
    addComponent({
      name: "SocialShare",
      kebabName: "social-share",
      filePath: resolve("./runtime/components/social-share.vue"),
    });
  },
});
