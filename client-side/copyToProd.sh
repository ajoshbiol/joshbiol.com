#!/bin/bash

echo Deleting current files in /data/joshbiol.com/
sudo rm -r /data/joshbiol.com/*
echo Done deleting current files in /data/joshbiol.com/

echo Copying files to /data/joshbiol.com/
sudo cp -r ~/facade/* /data/joshbiol.com/
echo Completed copying files to /data/joshbiol.com/

echo Changing permissions
sudo chmod 0775 /data/joshbiol.com/*
echo Completed changing permissions


echo Deleting ~/facade
rm -r ~/facade
echo Done deleting ~/facade
