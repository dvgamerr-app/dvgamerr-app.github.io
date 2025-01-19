---
layout: ../../layouts/Layout.astro
title: 'Disabling DHCP on macOS: A Step-by-Step Guide'
pubDate: 2025-01-19
description: 'Learn how to disable the built-in DHCP service on macOS to avoid port conflicts.'
author: 'Kananek T.'
image:
  url: 'https://docs.astro.build/assets/rose.webp'
tags: ["macOS", "DHCP", "networking"]
---
# Disabling DHCP on macOS: A Step-by-Step Guide

If you encounter issues such as port conflicts when running a DHCP server on macOS, you might need to disable the built-in DHCP service. This guide walks you through the process of disabling DHCP using the `bootpd.plist` configuration file.

---

## Symptoms of DHCP Conflicts

An example error message might look like this:

```
Error: control/dhcp/set_config 
enabling dhcp: starting dhcp server: dhcpv4:
creating ipv4 udp connection: cannot bind to port 67: address already in use
```

This indicates that another process is already using port 67, which is reserved for DHCP.

---

## Steps to Disable DHCP on macOS

### 1. **Locate and Edit Configuration File**

Open Terminal and edit the `bootpd.plist` file located in `/etc/`:

```bash
sudo nano /etc/bootpd.plist
```

### 2. **Modify DHCP Settings**

- **Disable DHCP**:
  Locate the `<key>dhcp_enabled</key>` section and set its value to an empty `<array>`:
  ```xml
  <key>dhcp_enabled</key>
  <array/>
  ```

- **Remove or Disable Subnets**:
  If there is a `<key>Subnets</key>` section, comment it out or remove the `<dict>` entirely.

- **Disable BOOTP**:
  Ensure the following key is set to `false`:
  ```xml
  <key>bootp_enabled</key>
  <false/>
  ```

### 3. **Save and Exit**

Press `Ctrl + O` to save changes, then `Ctrl + X` to exit the editor.

---

### 4. **Restart Networking Services**

Restart the `bootpd` service to apply the changes:

```bash
sudo launchctl stop com.apple.bootpd
sudo launchctl unload /System/Library/LaunchDaemons/bootps.plist
```

This stops the DHCP service from running.

### 5. **Verify Changes**

Check if port 67 is still in use:

```bash
sudo lsof -i :67
```

If no output appears, the DHCP service has been successfully disabled.

---

## Troubleshooting

### Port Still in Use?
- Use the following command to identify processes using port 67:
  ```bash
  sudo lsof -i :67
  ```
- Stop the process:
  ```bash
  sudo kill -9 <PID>
  ```

### Restore Defaults
If needed, restore the original configuration:

```bash
sudo cp /etc/bootpd.plist /etc/bootpd.plist.bak
sudo defaults write /etc/bootpd.plist ""
```

---

By following this guide, you can successfully disable DHCP on macOS, resolve port conflicts, and ensure your network services run smoothly.

