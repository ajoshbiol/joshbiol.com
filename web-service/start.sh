#!/bin/bash

export NODE_ENV=production;
nohup nodejs web-service/monitor/monitor.js > out.log 2> err.log </dev/null &
