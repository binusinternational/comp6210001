#!/bin/sh

#reference: https://www.youtube.com/watch?v=j_UUnlVC2Ss

# create namespaces
ip netns add red
ip netns add green
ip netns add blue

# create veths
ip link add veth-red type veth peer name veth-red-br
ip link add veth-green type veth peer name veth-green-br
ip link add veth-blue type veth peer name veth-blue-br

# create a virtual bridge to simulate a switch
ip link add v-bridge type bridge

# attach the veths
ip link set veth-red netns red
ip link set veth-red-br master v-bridge

ip link set veth-green netns green
ip link set veth-green-br master v-bridge

ip link set veth-blue netns blue
ip link set veth-blue-br master v-bridge

# set ip addr inside namespace
ip netns exec red ip addr add 10.1.1.2/24 dev veth-red
ip netns exec green ip addr add 10.1.1.3/24 dev veth-green
ip netns exec blue ip addr add 10.1.1.4/24 dev veth-blue

# set ip addr for the v-bridge
ip addr add 10.1.1.1/24 dev v-bridge

# activate all interfaces
ip link set dev v-bridge up
ip link set dev veth-red-br up
ip link set dev veth-green-br up
ip link set dev veth-blue-br up
ip netns exec red ip link set dev veth-red up
ip netns exec green ip link set dev veth-green up
ip netns exec blue ip link set dev veth-blue up

# set ip route table
ip netns exec red ip route add default via 10.1.1.1 dev veth-red
ip netns exec green ip route add default via 10.1.1.1 dev veth-green
ip netns exec blue ip route add default via 10.1.1.1 dev veth-blue

# set nat
iptables -t nat -A POSTROUTING -s 10.1.1.0/24 -j MASQUERADE
