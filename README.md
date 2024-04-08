<div align="center">
  <h1>Trail</h1>

  <p>
    <strong>Platform to create and share your trips</strong>
  </p>

  <p>  
    <a href="https://app.codecov.io/gh/gilengel/trail" rel="nofollow"><img src="https://img.shields.io/codecov/c/github/gilengel/trail?style=for-the-badge" alt="coverage"></a>
    <a href="https://github.com/gilengel/trail/blob/main/LICENSE"><img src="https://img.shields.io/github/license/gilengel/trail?style=for-the-badge" alt="license"></a>
  </p>  
</div>

# Vision

There are multiple commercial applications available that let you plan, navigate and share routes for your favorite activities. While they generally offer you a great service for a decent price you'll always need to pay for these services and you don't really know what these services really do with your data - the everlasting problem of commercial software.

Trail wants to be a good alternative, free and open source so that everyone can use it and check how the data is handled by it.

# Free & Open Source

Trail is licensed under the AGPL license. That means you can use the source code for your own project (even commercially) but you are obliged to make your code as well available under the AGPL license.

# Development

Trail is in very early development and so far more a vision than an actual product.

## Requirements

You'll need to install the following software to get started:

- Docker (tested with version 25.0.4)
- NodeJS (tested with version 20.9.0)

## Getting Started

You can leverage `docker-compose` to use development by either using

`docker compose -f docker-compose-dev.yml up`

or

`docker compose -f docker-compose-dev.yml watch`

from the main directory of trail. Be aware that watch is a relatively new command and not available in older docker versions.
