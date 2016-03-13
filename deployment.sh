#!/bin/bash

#Copy files to server
rsync -avz --exclude "deployment.sh" --exclude "web-service/tools" --exclude "README" --progress ./* josh@45.55.153.9:~
