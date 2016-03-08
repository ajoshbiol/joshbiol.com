#!/bin/bash

#Copy files to server
rsync -avz --exclude "deployment.sh" --exclude "./tools" --exclude "README" --progress ./* josh@45.55.153.9:~
