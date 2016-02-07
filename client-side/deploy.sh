#!/bin/bash

echo Starting deployment script.
echo Copying files to server.

scp -i ~/.ssh/do_website -r ./facade josh@45.55.153.9:

echo Completed copying files to server.
echo Running script to copy files to /data/joshbiol.com

ssh -i ~/.ssh/do_website josh@45.55.153.9 'bash -s' < ./copyToProd.sh

echo Completed running script to copy files to /data/joshbiol.com
echo Completed deployment script.
