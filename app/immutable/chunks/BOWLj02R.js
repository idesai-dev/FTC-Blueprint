const n=`---\r
title: Basics of Wiring and Configuration\r
date: 2026-03-28\r
description: Essential guide to wiring your FTC robot and configuring it in the app.\r
tags: [software, beginner, manual, completed guide]\r
author: Ishaan Desai\r
published: true\r
---\r
\r
Proper wiring and configuration are the foundation of a reliable FTC robot. This guide covers the basics of connecting your hardware to the Control Hub or Expansion Hub and setting it up in the FTC Robot Controller app.\r
\r
## Wiring Your Robot\r
\r
### 1. Connecting Motors\r
\r
Motors should be connected to the motor ports on the Control Hub or Expansion Hub. Ensure you use the correct cable type for your motors (e.g., Anderson Powerpole or JST-VH).\r
\r
### 2. Connecting Servos\r
\r
Servos are connected to the servo ports. Pay close attention to the orientation of the connectors; the black (ground) wire should be on the outside.\r
\r
### 3. Connecting Sensors\r
\r
Most sensors in FTC use I2C, Digital, or Analog ports.\r
\r
- **I2C:** Used for sensors like the IMU, color sensors, and distance sensors.\r
- **Digital:** Used for touch sensors or limit switches.\r
- **Analog:** Used for potentiometers or specialized sensors.\r
\r
## Configuring Your Robot in the App\r
\r
Once your hardware is wired, you must configure it in the FTC Robot Controller app so your code knows which device is on which port.\r
\r
### 1. Accessing the Configuration\r
\r
On the Driver Station app, navigate to **Settings > Configure Robot**.\r
\r
### 2. Creating a Configuration\r
\r
Select **New** to create a new configuration. The app will scan for connected hubs.\r
\r
### 3. Naming Your Devices\r
\r
For each port, select the device type and give it a unique name. This name _must_ match the string you use in your Java code's \`hardwareMap.get()\` call.\r
\r
\`\`\`java\r
// Example: The name "leftDrive" in the app must match here\r
DcMotor leftDrive = hardwareMap.get(DcMotor.class, "leftDrive");\r
\`\`\`\r
\r
- **Secure Connections:** Ensure every connector is fully seated and won't vibrate loose during a match.\r
`;export{n as default};
