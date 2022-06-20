#!/bin/sh

# delete namespaces
ip netns del red
ip netns del green
ip netns del blue

# delete v-bridge
ip link del dev v-bridge

# delete iptables rule
iptables -t nat -D POSTROUTING -s 10.1.1.0/24 -j MASQUERADE
