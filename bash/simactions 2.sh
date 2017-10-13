#!/bin/sh
##
# Build and/or run MiFi Simulator Environment
PROGRAM=${0##*/}
SERVICE="MiFi OS"
VERSION="1.3"

##
# show program version
version()
{
cat << EOF

 $SERVICE ($PROGRAM) version $VERSION

EOF
}

##
# print message and exit
abend()
{
 echo "$*"
 exit 1
}

simstart()
{
	[ "$SWPLT" ] || SWPLT=$PLT
	echo "$PROGRAM: starting simulator for platform-$SWPLT"
	sudo ipcrm -M 8088
	sudo ipcrm -M 8082
	sudo ipcrm -M 8888
	simlink
	sim
}

simlink()
{
	sudo unlink /opt/nvtl/root
	sudo ln -s $WORKSPACE/MiFiOS/Kernel/Desktop/Main/LINUX/platform-$PLT/root /opt/nvtl/root
	echo "$PROGRAM: created soft link to platform-$PLT/root"
}

simbuild()
{
	[ "$SWPLT" ] || SWPLT=$PLT
	echo "$PROGRAM: making clean build of platform-$SWPLT"
	simlink
	make clean_sim plt=$SWPLT
	make clean_linux plt=$SWPLT
	make all plt=$SWPLT
}

##
# show program usage
usage()
{
cat << EOF
Usage: $PROGRAM [-h] | -b <product> [<software>]  | -l <product> [<software>]  | -s <product> [<software>]  | [-v]

$PROGRAM combines specific actions to build and run
the desktop MiFi simulator environment.

 OPTIONS
  -h                        show usage and exit; what you are reading
  -b <product> [<software>] make a clean build of the product/platform
  -l <product> [<software>] make soft link from product/platform root
                            to /opt/nvtl/root
  -s <product> [<software>] start simulator for a product/platform
  -v                        version

For example, to build Jasper:
	$PROGRAM -b geneva jasper

Copyright (c) $(date +%Y) by Novatel Wireless, Inc.
EOF
}

# WORKSPACE must be set in the environment
if [ -z "$WORKSPACE" ]; then
cat << EOF

export WORKSPACE="<local workspace path>" must be set
before running $PROGRAM.

For example, from the command line, WORKSPACE can be
defined like this:

  export WORKSPACE="$HOME/my_workspace"

Or, the same line can be added to the local .bashrc file to
define WORKSPACE for every terminal session.

EOF
	exit 1
fi

# error if WORKSPACE can't be found.
[ -e $WORKSPACE ] || abend "$PROGRAM: $WORKSPACE no such file or directory"


if [ $# == 0 ]; then
	usage
	exit 0
fi

while getopts ":hb:l:s:vt:" opt
do
  case $opt in
    h) usage; exit 0 ;;
    b) PLT=$OPTARG; eval "SWPLT=\${$OPTIND}"; shift 2; simbuild; exit 0 ;;
    l) PLT=$OPTARG; eval "SWPLT=\${$OPTIND}"; shift 2; simlink; exit 0 ;;
    s) PLT=$OPTARG; eval "SWPLT=\${$OPTIND}"; shift 2; simstart; exit 0 ;;
    v) version; exit 0 ;;
    \?) abend "$PROGRAM: unrecognized option: -$OPTARG (use: -h for help)" ;;
    :) abend "$PROGRAM: option -$OPTARG requires a product, ie: alaska." ;;
  esac
done
