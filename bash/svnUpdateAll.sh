#!/bin/sh
# SVN update all directories in this workspace.
for i in *;
do 
if [ -d $i ]; then
	if [ ! -L $i ]; then
		svn up $i; 
	fi
fi;
done
