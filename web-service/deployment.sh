#!/bin/bash

#Copy files to server
rsync -avz --exclude "deployment.sh" -e "ssh -i /cygdrive/c/Users/joshb/.ssh/id_rsa -o StrictHostKeyChecking=no" --progress ./* josh@45.55.153.9:~/web-service
