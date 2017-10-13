#!/bin/sh
##
# Build and/or run MiFi Simulator Environment
PROGRAM=${0##*/}
SERVICE="MiFi OS"
VERSION="1.2"

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
	echo "$PROGRAM: starting simulator for platform-$PLT"
	sudo ipcrm -M 8088
	sudo ipcrm -M 8082
	simlink
	sim
}

simlink()
{
	[ "$SWPLT" ] || SWPLT=$PLT
	sudo unlink /opt/nvtl/root
	sudo ln -s $(pwd)/LINUX/platform-$SWPLT/root /opt/nvtl/root
	echo "$PROGRAM: created soft link to platform-$PLT/root"
}

simbuild()
{
	echo "$PROGRAM: making clean build of platform-$PLT"
	simlink
	make clean_linux plt=$PLT
	make all plt=$PLT
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

Copyright (c) $(date +%Y) by Novatel Wireless, Inc.
EOF
}

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

