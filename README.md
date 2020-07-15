# XNAT Portal Backend

XNAT Portal Backend is a flask application that interfaces with XNAT to
automate some common tasks. Right now those tasks are all project related
(listing, getting details, adding collaborators, creating new projects, etc.)
but tasks will happen later.

## Development

To install XNAT Portal Backend you'll need [Poetry][poetry]. And you'll need
to install the projects dependencies:

```
poetry install
```

All common development tasks have been placed in the `Makefile`.

| Action        | Command       |
| ------------- | ------------- |
| Testing       | `make test`   |
| Linting       | `make lint`   |
| Formatting    | `make format` |
| Type Checking | `make check`  |

[poetry]: https://python-poetry.org/docs/#installation
