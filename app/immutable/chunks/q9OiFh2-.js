const r=`---\r
title: Mecanum Drivetrain\r
date: 2026-03-28\r
description: Programming and optimizing a 4-wheel mecanum drivetrain for FTC.\r
tags: [software, beginner, drivetrain]\r
author: Ishaan Desai\r
published: true\r
---\r
\r
Mecanum wheels are unique in that they use 45-degree rollers to generate forces in different directions. By changing the speed and direction of the four motors, your robot can move in any direction (strafing) and rotate simultaneously.\r
\r
## Mecanum Vectoring\r
The most important thing to understand is how the wheels combine to create movement:\r
- **Forward:** All 4 wheels forward.\r
- **Strafe Left:** Front-Right and Back-Left forward, Front-Left and Back-Right backward.\r
- **Turn Left:** Right side forward, left side backward.\r
\r
---\r
\r
## Robocentric Driving\r
In Robocentric driving, the robot moves relative to its own front. Pushing the stick forward always makes the robot go where its nose is pointing.\r
\r
### The Equations:\r
\`\`\`java\r
double y = -gamepad1.left_stick_y; // Straight power\r
double x = gamepad1.left_stick_x;  // Strafe power\r
double rx = gamepad1.right_stick_x; // Rotation power\r
\r
// Calculate wheel powers\r
double frontLeftPower = y + x + rx;\r
double backLeftPower = y - x + rx;\r
double frontRightPower = y - x - rx;\r
double backRightPower = y + x - rx;\r
\`\`\`\r
\r
---\r
\r
## Field Centric Driving\r
Field Centric driving makes the robot move relative to the **field**, not itself. Pushing forward on the stick will make the robot move away from you, regardless of which way it is facing.\r
\r
### Why use Field Centric?\r
- **Easier for Drivers:** No need to compensate for the robot's orientation.\r
- **Consistent Control:** The robot always behaves the same way relative to the driver's perspective.\r
\r
### The Implementation (using IMU):\r
\`\`\`java\r
// Read the robot's heading from the IMU\r
double botHeading = imu.getRobotYawPitchRollAngles().getYaw(AngleUnit.RADIANS);\r
\r
// Rotate the input vector by the negative of the robot's heading\r
double rotX = x * Math.cos(-botHeading) - y * Math.sin(-botHeading);\r
double rotY = x * Math.sin(-botHeading) + y * Math.cos(-botHeading);\r
\r
// Now apply the rotated powers (rotX and rotY) instead of raw x and y\r
double fl = rotY + rotX + rx;\r
double bl = rotY - rotX + rx;\r
double fr = rotY - rotX - rx;\r
double br = rotY + rotX - rx;\r
\`\`\`\r
\r
## Standard Drive Functions\r
When programming your drivetrain, ensure you normalize the motor powers so that no single value exceeds 1.0, which would cause inconsistent movements.\r
\r
\`\`\`java\r
// Find the maximum value among the four powers\r
double max = Math.max(Math.abs(fl), Math.max(Math.abs(bl), \r
             Math.max(Math.abs(fr), Math.abs(br))));\r
\r
// If the max is greater than 1.0, scale them all down\r
if (max > 1.0) {\r
    fl /= max;\r
    bl /= max;\r
    fr /= max;\r
    br /= max;\r
}\r
\r
// Apply the powers to the motors\r
frontLeft.setPower(fl);\r
backLeft.setPower(bl);\r
frontRight.setPower(fr);\r
backRight.setPower(br);\r
\`\`\`\r
`;export{r as default};
