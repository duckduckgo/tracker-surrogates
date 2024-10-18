# tracker-surrogates

Surrogates are small scripts that our apps and extensions serve in place of trackers that cause site breakage when blocked. Surrogates mock the API structure of the original scripts they replace, allowing pages that depend on the existence of certain methods, or properties, to function as if the original script was loaded.

## How this repository is used

All surrogates are bundled together and [deployed to a CDN](https://duckduckgo.com/contentblocking.js?l=surrogates) from which they are picked by client apps and extensions.
For platforms that don't allow remote code execution this repository is imported as a git submodule and surrogates are embedded at build time.

DuckDuckGo clients using surrogates:
- [Chrome and Firefox extensions](https://github.com/duckduckgo/duckduckgo-privacy-extension)
- [Safari extension](https://github.com/duckduckgo/privacy-essentials-safari)
- [iOS app](https://github.com/duckduckgo/iOS)
- [Android app](https://github.com/duckduckgo/Android)

## Structure of this repository

- `scripts/` - testing and deployment scripts
- `surrogates/` - surrogate files
- `mapping.json` - list of regular expressions that map urls to surrogates that should be served as request responses. Data from this file is incorporated into the [web blocklist](https://github.com/duckduckgo/tracker-blocklists/tree/main/web).

Format of the `mapping.json` file:

```js
{
    "example.com": [
        {
            "regexRule": "example.com\\/rule\\/matching\\/[a-z_A-Z]+\\/file.js", // regular expression for matching urls
            "surrogate": "surrogate_name.js", // name of the file from the `surrogates/` folder
            "action": "block-ctl-example" // optional action name, used by the blocklist, indicating that this surrogate is meant for the Click To Load feature
        },
        …
    ],
    …
}
```

> [!WARNING]
> Be careful when adding new surrogate scripts to the `mapping.json`
> file. The block lists are regenerated using the version of
> `mapping.json` pushed to main (not the version most recently
> released). From there, redirection rules are automatically added,
> sometimes even for requests that have specific exceptions. If the
> surrogate script in question is not yet available on a given
> platform, the corresponding requests might start being blocked!

## Contributing

We don't take external contributions at this time, but please feel free to open issues.
