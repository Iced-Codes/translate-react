import {
  defineConfig,
  presetWind3,
  presetAttributify,
  presetWind4,
  transformerAttributifyJsx,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
export default defineConfig({
  rules: [],
  presets: [presetWind3(), presetAttributify(), presetWind4()],
  transformers: [transformerAttributifyJsx(), transformerDirectives(), transformerVariantGroup()],
});
