# Parser

All libs and groups are stored in assets.json.
We parse all of them before parse pages.

````
"libs": {
        "jquery": {
            "name": "jquery",
            "files": [
                "site/assets/lib/jquery/jquery.js"
            ]
        },
        "bootstrap": {
            "name": "bootstrap",
            "files": [
                "site/assets/lib/bootstrap/css/bootstrap.css",
                "site/assets/lib/bootstrap/js/bootstrap.js"
            ]
        },
        "date-time": {
            "name": "date-time",
            "files": ["site/assets/lib/date-time/*.*"],
            "dependencies": [
                "jquery",
                "bootstrap"
            ]
        }
    },
    "groups": {
        "base": {
            "name": "base",
            "libs": [
                "jquery",
                "bootstrap"
            ],
            "files": ["run.js"]
        },
        "dt": {
            "name": "dt",
            "libs": ["date-time"]
        }
    }
````

libs can have dependencies while groups can't.