#!/usr/bin/env node

function start() {
  if (typeof require !== 'undefined') {
    require('../dist/cli.cjs')
  }
  else {
    return import('../dist/cli.mjs')
  }
}

start()
