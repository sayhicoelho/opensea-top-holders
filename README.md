# OpenSea Top Holders

This script will run over OpenSea's API to retrieve all assets from the contract, splitting 50 assets per request. Once all the assets are retrieved, we'll use the `_.countBy` function of lodash to write a file with all the contracts and their assets count.

## Setup

Copy and rename `.env.example` to `.env` and put your environment variables.

## Install

```bash
yarn install
```

## Run

```bash
node .
```
