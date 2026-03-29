const r=`---\r
title: Basics of Motors and Servos\r
date: 2026-03-28\r
description: Programming guide for DC motors and servos in FTC.\r
tags: [software, beginner, manual, completed guide]\r
author: Ishaan Desai\r
published: true\r
---\r
\r
Motors and servos are the primary actuators of an FTC robot. This guide covers how to program them in Java using the FTC Robot Controller app.\r
\r
## DC Motors\r
\r
DC motors provide the power for your drivetrain and other mechanisms like arms or linear slides.\r
\r
### 1. Initialization\r
\r
Use the \`hardwareMap\` to initialize your motor.\r
\r
\`\`\`java\r
DcMotor leftDrive = hardwareMap.get(DcMotor.class, "leftDrive");\r
\`\`\`\r
\r
### 2. Setting Direction\r
\r
Depending on how your motor is oriented, you might need to reverse its direction.\r
\r
\`\`\`java\r
leftDrive.setDirection(DcMotor.Direction.REVERSE);\r
\`\`\`\r
\r
### 3. Basic Control\r
\r
You can control the motor's power from -1.0 to 1.0.\r
\r
\`\`\`java\r
leftDrive.setPower(0.5); // 50% power forward\r
\`\`\`\r
\r
### 4. Zero Power Behavior\r
\r
Choose how the motor should behave when power is set to zero.\r
\r
- **Brake:** Resists movement (better for precision).\r
- **Float:** Free to spin (better for some intakes).\r
\r
\`\`\`java\r
leftDrive.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);\r
\`\`\`\r
\r
---\r
\r
## Servos\r
\r
Servos are used for precision movements, like grippers or small rotations.\r
\r
### 1. Standard Servos\r
\r
Standard servos move to a specific position from 0.0 to 1.0.\r
\r
\`\`\`java\r
Servo gripper = hardwareMap.get(Servo.class, "gripper");\r
gripper.setPosition(0.5); // Move to the middle position\r
\`\`\`\r
\r
### 2. Continuous Rotation (CR) Servos\r
\r
CR servos rotate continuously and are controlled like a DC motor.\r
\r
\`\`\`java\r
CRServo intake = hardwareMap.get(CRServo.class, "intake");\r
intake.setPower(1.0); // Full speed forward\r
\`\`\`\r
\r
- **Testing:** Use a simple test OpMode (like the FTC Dashboard servo test) to find the correct positions and directions for your motors and servos.\r
`;export{r as default};
