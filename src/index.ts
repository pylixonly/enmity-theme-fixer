// Based off https://github.com/amsyarasyiq/aliucordrn-plugins/blob/8b924a5bd20e4ed345b9a2c998660ba3669d2a8b/MagicThemeFixer/index.tsx
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps, getModule } from "enmity/metro";
import manifest from "../manifest.json";

// @ts-expect-error
const FluxDispatcher = window.enmity.modules.common.Dispatcher as any;

const ThemeStore = getModule((m) => m?.getName?.() === "ThemeStore");
const UnsyncedUserSettingsStore = getModule((m) => m?.getName?.() === "UnsyncedUserSettingsStore");
const ThemeManager = getByProps("overrideTheme");
const AMOLEDTheme = getByProps("setAMOLEDThemeEnabled");

const ThemeFixer: Plugin = {
   ...manifest,

   onStart() {
      const overrideTheme = function () {
         try {
            ThemeManager.overrideTheme(ThemeStore.theme ?? "dark");
            AMOLEDTheme.setAMOLEDThemeEnabled(UnsyncedUserSettingsStore.useAMOLEDTheme === 2);
            FluxDispatcher.unsubscribe("I18N_LOAD_START", overrideTheme);
         } catch (e) {
            console.error("An error occurred while trying to override theme:\n" + e?.stack ?? e);
         }
      };

      FluxDispatcher.subscribe("I18N_LOAD_START", overrideTheme);
   },

   onStop() { }
};

registerPlugin(ThemeFixer);
