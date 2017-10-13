#!/bin/sh
##
# Check out MDM9x15 from SVN
PROGRAM=${0##*/}
SERVICE="MiFi OS"
VERSION="1.0"
SVNBASE="http://nvtlsdssubv01:3690/svn-san"
SVNFIRMWAREBASE=$SVNBASE"/Firmware/trunks/"

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

costart()
{
	echo "$PROGRAM: start checking out Firmware"
	mkdir $WORKSPACE/Firmware
	svn co --depth immediates $SVNFIRMWAREBASE $WORKSPACE/Firmware/
}

cocommon()
{
	echo "$PROGRAM: checking out MDM9x15/common/"
	svn co --depth infinity $SVNFIRMWAREBASE/common $WORKSPACE/Firmware/common/
}

coMDM9x15()
{
	echo "$PROGRAM: start checking out MDM9x15"
	svn co --depth immediates $SVNFIRMWAREBASE/MDM9x15 $WORKSPACE/Firmware/MDM9x15/
}

coMDM9x15main()
{
	echo "$PROGRAM: checking out MDM9x15/Main/"
	svn co --depth immediates $SVNFIRMWAREBASE/MDM9x15/Main $WORKSPACE/Firmware/MDM9x15/Main/
	svn co --depth immediates $SVNFIRMWAREBASE/MDM9x15/Main/LINUX $WORKSPACE/Firmware/MDM9x15/Main/LINUX/
	svn co --depth immediates $SVNFIRMWAREBASE/MDM9x15/Main/LINUX/apps_proc $WORKSPACE/Firmware/MDM9x15/Main/LINUX/apps_proc/
	svn co --depth infinity $SVNFIRMWAREBASE/MDM9x15/Main/LINUX/apps_proc/bootable $WORKSPACE/Firmware/MDM9x15/Main/LINUX/apps_proc/bootable/
	svn co --depth infinity $SVNFIRMWAREBASE/MDM9x15/Main/LINUX/apps_proc/kernel $WORKSPACE/Firmware/MDM9x15/Main/LINUX/apps_proc/kernel/
	svn co --depth immediates $SVNFIRMWAREBASE/MDM9x15/Main/LINUX/apps_proc/nvtl $WORKSPACE/Firmware/MDM9x15/Main/LINUX/apps_proc/nvtl/
	svn co --depth infinity $SVNFIRMWAREBASE/MDM9x15/Main/LINUX/apps_proc/nvtl/src $WORKSPACE/Firmware/MDM9x15/Main/LINUX/apps_proc/nvtl/src/
}

coMDM9x15mainle30()
{
	echo "$PROGRAM: checking out MDM9x15/Main_LE30/"
	svn co --depth immediates $SVNFIRMWAREBASE/MDM9x15/Main_LE30 $WORKSPACE/Firmware/MDM9x15/Main_LE30/
	svn co --depth immediates $SVNFIRMWAREBASE/MDM9x15/Main_LE30/LINUX $WORKSPACE/Firmware/MDM9x15/Main_LE30/LINUX/
	svn co --depth immediates $SVNFIRMWAREBASE/MDM9x15/Main_LE30/LINUX/apps_proc $WORKSPACE/Firmware/MDM9x15/Main_LE30/LINUX/apps_proc/
	svn co --depth infinity $SVNFIRMWAREBASE/MDM9x15/Main_LE30/LINUX/apps_proc/bootable $WORKSPACE/Firmware/MDM9x15/Main_LE30/LINUX/apps_proc/bootable/
	svn co --depth infinity $SVNFIRMWAREBASE/MDM9x15/Main_LE30/LINUX/apps_proc/kernel $WORKSPACE/Firmware/MDM9x15/Main_LE30/LINUX/apps_proc/kernel/
	svn co --depth immediates $SVNFIRMWAREBASE/MDM9x15/Main_LE30/LINUX/apps_proc/nvtl $WORKSPACE/Firmware/MDM9x15/Main_LE30/LINUX/apps_proc/nvtl/
	svn co --depth infinity $SVNFIRMWAREBASE/MDM9x15/Main_LE30/LINUX/apps_proc/nvtl/recipes $WORKSPACE/Firmware/MDM9x15/Main_LE30/LINUX/apps_proc/nvtl/recipes/
}

coMDM9x15mainle40()
{
	echo "$PROGRAM: checking out MDM9x15/Main_LE40/"
	svn co --depth immediates $SVNFIRMWAREBASE/MDM9x15/Main_LE40 $WORKSPACE/Firmware/MDM9x15/Main_LE40/
	svn co --depth immediates $SVNFIRMWAREBASE/MDM9x15/Main_LE40/LINUX $WORKSPACE/Firmware/MDM9x15/Main_LE40/LINUX/
	svn co --depth immediates $SVNFIRMWAREBASE/MDM9x15/Main_LE40/LINUX/apps_proc $WORKSPACE/Firmware/MDM9x15/Main_LE40/LINUX/apps_proc/
	svn co --depth infinity $SVNFIRMWAREBASE/MDM9x15/Main_LE40/LINUX/apps_proc/bootable $WORKSPACE/Firmware/MDM9x15/Main_LE40/LINUX/apps_proc/bootable/
	svn co --depth infinity $SVNFIRMWAREBASE/MDM9x15/Main_LE40/LINUX/apps_proc/kernel $WORKSPACE/Firmware/MDM9x15/Main_LE40/LINUX/apps_proc/kernel/
	svn co --depth immediates $SVNFIRMWAREBASE/MDM9x15/Main_LE40/LINUX/apps_proc/nvtl $WORKSPACE/Firmware/MDM9x15/Main_LE40/LINUX/apps_proc/nvtl/
	svn co --depth infinity $SVNFIRMWAREBASE/MDM9x15/Main_LE40/LINUX/apps_proc/nvtl/recipes $WORKSPACE/Firmware/MDM9x15/Main_LE40/LINUX/apps_proc/nvtl/recipes/
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


if [ "$1" = "version" ]
then
	version
	exit 0
else
	costart
	cocommon
	coMDM9x15
	coMDM9x15main
	coMDM9x15mainle30
	coMDM9x15mainle40
	echo "$PROGRAM: Firmware checkout complete"
	exit 0
fi
