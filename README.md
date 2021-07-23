# tracker-surrogates

Surrogates are small scripts that our apps and extensions serve in place of trackers that cause site breakage when blocked. Surrogates mock the API structure of the original scripts they replace, allowing pages that depend on the existence of certain methods, or properties, to function as if the original script was loaded.

## How this repository is used

All surrogates are bundled together and deployed to a CDN from which they are picked by clients.
For platforms that don't allow remote code execution this repository is imported as a git submodule and surrogates are embedded at build time.

DuckDuckGo clients using surrogates:
- [Chrome and Firefox extensions](https://github.com/duckduckgo/duckduckgo-privacy-extension)
- [Safari extension](https://github.com/duckduckgo/privacy-essentials-safari)
- [iOS app](https://github.com/duckduckgo/iOS)
- [Android app](https://github.com/duckduckgo/Android)

## Structure of this repository

- `scripts/` - testing and deployment scripts
- `surrogates/` - surrogate files
- `mapping.json` - file that contains url match rules for which surrogates should be served

Format of the `mapping.json` file:

```json
{
    "example.com": [
        ["example.com/rule/matching/file.js", "surrogate_name.js"],
        …
    ],
    …
}
```

`surrogate_name.js` should match name of the file from the `surrogates` folder.

## Contributing

We don't take external contributions at this time, but please feel free to open issues.