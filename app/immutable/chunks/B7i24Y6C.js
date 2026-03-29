const e=`---\r
title: Bulk Reads\r
date: 2026-03-28\r
description: Optimizing your FTC robot's control loop with LynxModule bulk reading.\r
tags: [software, intermediate, performance]\r
author: Ishaan Desai\r
published: true\r
---\r
\r
Bulk reading is the most effective way to optimize your robot's loop time. In a standard FTC OpMode, every sensor or motor read (like \`motor.getCurrentPosition()\`) triggers a separate and slow I2C/Serial communication with the Control or Expansion Hub. \r
\r
Bulk reads allow you to capture **all** of the hub's data (encoder positions, sensor values, etc.) in a single, efficient command.\r
\r
## Setting Up Bulk Reads\r
To use bulk reads, you need to access the \`LynxModule\` (the Rev Hub) in your code.\r
\r
\`\`\`java\r
public void initBulkReads() {\r
    List<LynxModule> allHubs = hardwareMap.getAll(LynxModule.class);\r
\r
    for (LynxModule hub : allHubs) {\r
        hub.setBulkCachingMode(LynxModule.BulkCachingMode.AUTO);\r
    }\r
}\r
\`\`\`\r
\r
## The Three Modes\r
There are three different ways to handle bulk reads in FTC:\r
\r
### 1. OFF (Default)\r
This is the default mode. No bulk reading is performed. Every single sensor or motor read triggers a new communication request with the hub, which is slow.\r
\r
### 2. AUTO (Recommended)\r
This mode automatically performs a bulk read whenever it needs data and clears the cache once per control loop. This is the easiest mode to use and provides a massive speed boost with almost zero effort.\r
\r
### 3. MANUAL (Most Accurate)\r
Manual mode gives the most control. You must manually call \`hub.clearBulkCache()\` at the beginning of each loop. This ensures you are always using the latest data and that the cache is handled exactly when you want it.\r
\r
\`\`\`java\r
// At the start of your while(opModeIsActive()) loop:\r
for (LynxModule hub : allHubs) {\r
    hub.clearBulkCache();\r
}\r
\`\`\`\r
\r
## Why This Matters\r
Without bulk reads, a typical control loop might run at **40-60 Hz**. With bulk reads enabled, you can easily reach **100 Hz** or even **200 Hz**, depending on the complexity of your code. Faster loops lead to more responsive control, especially for PID and odometry.\r
`;export{e as default};
