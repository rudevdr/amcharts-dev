import { Entity } from "./Entity";
import * as $array from "./Array";
import * as $object from "./Object";
import en from "../../../locales/en";
;
/**
 * Add localization functionality.
 */
export class Language extends Entity {
    _setDefaults() {
        this.setPrivate("defaultLocale", en);
        super._setDefaults();
    }
    /**
     * Returns a prompt translation.
     *
     * @param   prompt   Prompt to translate
     * @param   locale   Target locale
     * @param   ...rest  Parameters
     * @return           Translation
     */
    translate(prompt, locale, ...rest) {
        // Get langauge
        if (!locale) {
            locale = this._root.locale || this.getPrivate("defaultLocale");
        }
        // Init translation
        let translation = prompt;
        let value = locale[prompt];
        // Try to look for the translation
        if (value === null) {
            translation = "";
        }
        else if (value != null) {
            // It might be an empty string
            if (value) {
                translation = value;
            }
        }
        else if (locale !== this.getPrivate("defaultLocale")) {
            // Try to look in default language
            return this.translate(prompt, this.getPrivate("defaultLocale"), ...rest);
        }
        // Replace %1, %2, etc params
        if (rest.length) {
            for (let len = rest.length, i = 0; i < len; ++i) {
                translation = translation.split("%" + (i + 1)).join(rest[i]);
            }
        }
        // Return the translation
        return translation;
    }
    /**
     * Returns a prompt translation, including custom prompts.
     *
     * @param   prompt   Prompt to translate
     * @param   locale   Target locale
     * @param   ...rest  Parameters
     * @return           Translation
     */
    translateAny(prompt, locale, ...rest) {
        return this.translate(prompt, locale, ...rest);
    }
    /**
     * Add a custom prompt to locale.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/locales/creating-translations/#Extending_locale_with_custom_prompts}
     * @param  prompt       Source prompt
     * @param  translation  Tanslation
     * @param  locale       Target locale
     */
    setTranslationAny(prompt, translation, locale) {
        const localeTarget = locale || this._root.locale;
        localeTarget[prompt] = translation;
    }
    /**
     * Add a batch of custom prompts.
     *
     * @since 5.3.3
     * @see {@link https://www.amcharts.com/docs/v5/concepts/locales/creating-translations/#Extending_locale_with_custom_prompts}
     * @param  translations  Translations
     * @param  locale        Target locale
     */
    setTranslationsAny(translations, locale) {
        $object.each(translations, (key, val) => {
            this.setTranslationAny(key, val, locale);
        });
    }
    translateEmpty(prompt, locale, ...rest) {
        let translation = this.translate(prompt, locale, ...rest);
        return translation == prompt ? "" : translation;
    }
    translateFunc(prompt, locale) {
        if (this._root.locale[prompt]) {
            return this._root.locale[prompt];
        }
        // Try to look in default language
        if (locale !== this.getPrivate("defaultLocale")) {
            return this.translateFunc(prompt, this.getPrivate("defaultLocale"));
        }
        // Fail - return empty function
        return () => {
            return "";
        };
    }
    /**
     * Translates a btach of prompts.
     *
     * @param  list    Array of prompts to translate
     * @param  locale  Target locale
     * @return         Array of translations
     */
    translateAll(list, locale) {
        // Translate all items in the list
        if (!this.isDefault()) {
            return $array.map(list, (x) => this.translate(x, locale));
        }
        else {
            return list;
        }
    }
    /**
     * Returns `true` if the currently selected locale is a default locale.
     *
     * @return `true` if locale is default; `false` if it is not.
     */
    isDefault() {
        return this.getPrivate("defaultLocale") === this._root.locale;
    }
}
//# sourceMappingURL=Language.js.map