# Seediva release checks

For every site update, after publishing, run the language checks and inspect the published English, Simplified Chinese and Spanish interfaces. This is an explicit user requirement.

- Run `node scripts/check-release-locales.mjs` and feature regression tests before packaging; repeat the locale check after publication.
- Inspect all current main pages plus their affected dialogs, filters, searchable food/exercise data, recipe collections, badge descriptions, accessibility labels and date labels in each language.
- Verify the published release with a fresh background tab. Do not change the owner's production language or health records merely to test. Use synthetic local accounts for preference and data mutations. Read-only `?lang=en`, `?lang=zh-CN` and `?lang=es` URLs allow published-language QA without changing saved preferences.
- User-authored names, messages, descriptions, proper brand names, technical abbreviations and external publisher audio/titles remain original; surrounding application UI must follow the selected language.
- Keep a record of tested coverage and clearly report any incomplete verification. Fix observed translation failures and re-publish before declaring the release complete.
