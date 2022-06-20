# Network Scanning

## Overview

Previously, you performed a footprinting.
The goal of that step is to gather information about your target as much as possible.
The output is your target's security profile.
Parts of the profile are, for example, network information (domains, sub-domains, IP address range, network topology, etc).

Upon collecting the network information, now, you can deep dive knowing your target by scanning the network.
Specifially, we will focus on:

- discovering active hosts,
- discovering open ports and live services, and
- discovering your target's OS.

## Table of Contents

- [01-host-discovery](01-host-discovery)


# Requirements

- iproute2 5.16.0-2
- iptables 1.8.7-1
- ncat 7.92+dfsg2-1kali1

# Scenarios

Below is a list of setups for this module.

## Setup-A

We use linux namespaces here.
The topology can be seen below.

```
+----------+
| red      |
| 10.1.1.2 +-------------------+
+----------+                   |
                               |
+----------+             +-----+-----+
| green    |             |v-bridge   |
| 10.1.1.3 +-------------+nat        |
+----------+             |10.1.1.1/24|
                         +-----+-----+
+----------+                   |
| blue     |                   |
| 10.1.1.4 +-------------------+
+----------+
```

### Installation

- To start
  ```
  sudo bash create-setup-a.sh
  ```

- To remove
  ```
  sudo bash remove-setup-a.sh
  ```

- To validate
  ```
  sudo ip netns exec red ping 10.1.1.1 
  sudo ip netns exec red ping 10.1.1.3
  sudo ip netns exec red ping 10.1.1.4
  sudo ip netns exec red ping 1.1.1.1 
  sudo ip netns exec red ping google.com
  ```