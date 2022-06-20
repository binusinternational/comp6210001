# Host Discovery

In footprinting, we need to make sure that we can do it as quick as possible.
From the red team's PoV, you want to do it such that your target is not aware of your activity.
A naive way would be, to scan everything (e.g., open ports, vulnerabilities, OSs, etc) at once.
This method is time consuming, and it is very likely that your target is aware of your scanning activity.
Consequently, your target can react and close your access to the networks that you are scanning.

There are several host discovery techniques.
That is,:

- ARP ping scan,
- UDP ping scan, or
- IP protocol scan.

## ICMP Timestamp

Sometimes, ICMP echo protocol is blocked by a firewall. For example, by using iptables, we can set a firewall that drops the ICMP echo request as follows

```
iptables -A INPUT -p icmp --icmp-type 8 -j DROP
```

Note that you can run the iptables command above from inside the blue namespace in the Setup-A.

To remove the iptables rule above:
```
iptables -D INPUT -p icmp --icmp-type 8 -j DROP
```




