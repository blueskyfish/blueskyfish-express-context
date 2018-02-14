
![BlueSkyFish Express Context](logo.png)

# BlueSkyFish Express Context

> A small library for express micro services summarize the request and response.

Helpful classes and functions for create a express micro service.


## Requirements

* [NodeJS][nodejs] Version 8.x or higher.
* [Typescript][typescript] Version 2.6.2 or higher.
* [Express][express] Version 4.16 or higher

Global installed typescript. `npm install --global typescript`.

The library is written in [Typescript][typescript]. During the installation of the library it will be compiled into Javascript **ES2015** modules.


## Installation


```bash
$ npm install -S blueskyfish-express-commons
```


## History

| Version    | Date       | Description
|------------|:----------:|--------------------------------------------
| `0.0.8`    | 2018-02-14 | context send error use interface IBaseError.
| `0.0.7`    | 2018-02-11 | request params with string and number (`reg.params[0]` or `req.params['name']`)
| `0.0.6`    | 2018-01-25 | get express request values from the IContext; Enable to override HttpContext; add protected actionMap property;
| `0.0.2`    | 2018-01-24 | auth middleware
| `0.0.1`    | 2018-01-24 | Initial the library. It is extract from my other internal projects.


## License

```text
The MIT License
Copyright 2018 BlueSkyFish
```

[nodejs]: https://nodejs.org/en/
[typescript]: https://www.typescriptlang.org/
[express]: https://expressjs.com/
