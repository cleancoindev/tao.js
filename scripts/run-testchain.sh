#!/usr/bin/env bash
set -e

CWD="${0%/*}"

$CWD/set-polling-interval.sh
$CWD/../node_modules/@cleancoindev/testchain/scripts/launch -s default --fast $@
