#!/bin/sh

# ------------------------------------------------------------------------
# adblock 
#
# This script swaps the ad blocker hosts file with the default hosts file and vice-versa.
#
# This script expects the files hosts_MAC and hosts_ADBLOCK in the /etc directory.
# It uses these files to swap the hosts file. After the swap, lookupd is restarted.
#
# John C. Scott
#
# This script is released to the public domain.  
# Do whatever you want with it.
# ------------------------------------------------------------------------

# ----------------------------------------------------------------------
# command line arguments 
# ----------------------------------------------------------------------

if [ $# -lt 1 ]; then
	echo "usage: `basename $0` [on|off]"
	exit 1
fi

hosts_files=(hosts_ADBLOCK hosts_MAC) 

for i in ${hosts_files[@]}; do 
	if [ ! -f /etc/${i} ]; then
		echo "/etc/${i} doesn't exist!"
		exit 1
	fi
done 

# ----------------------------------------------------------------------
# adblock
# ----------------------------------------------------------------------

case "$1" in 
'on') 
	sudo cp /etc/hosts_ADBLOCK /etc/hosts
	#sudo lookupd -flushcache     # pre-Leopard
  	sudo dscacheutil -flushcache  # for 10.5+
 	 echo "AD Blocking is ON."
	;; 
'off') 
	sudo cp /etc/hosts_MAC /etc/hosts
	#sudo lookupd -flushcache     # pre-Leopard
  	sudo dscacheutil -flushcache  # for 10.5+
  	echo "AD Blocking is OFF."
	;; 
esac 
exit 0 
