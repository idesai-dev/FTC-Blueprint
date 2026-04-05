---
title: Mecanum Drivetrain
date: 2026-03-28
description: Programming and optimizing a 4-wheel mecanum drivetrain for FTC.
tags: [completed, software, beginner, completed]
author: Ishaan Desai
published: true
---

Mecanum drivetrains are by far the most popular drivetrain in modern FTC. While they provide holonomic (omnidirectional) movement, programming the driving math and interpreting wheel vectors can be confusing for rookies.

<div class="tuner-callout" style="padding: 1.5rem; background: rgba(116, 215, 237, 0.05); border-radius: var(--radius-md); border-left: 4px solid var(--accent-cyan); margin: 2rem 0;">
    <p> 🕹️ <strong>Try our new full-page <a href="/simulators/mecanum">Mecanum Simulator</a></strong> to visualize the kinematics and math interactively!</p>
</div>

There are a few key steps to get your Mecanum drivetrain working effectively:

---

## Mecanum Vectoring

The most important thing to understand is how the wheels combine to create movement:

- **Forward:** All 4 wheels forward.
- **Strafe Left:** Front-Right and Back-Left forward, Front-Left and Back-Right backward.
- **Turn Left:** Right side forward, left side backward.

<br>

---

## Robocentric Driving

In Robocentric driving, the robot moves relative to its own front. Pushing the stick forward always makes the robot go where its nose is pointing.

### The Equations:

```java
double y = -gamepad1.left_stick_y; // Straight power
double x = gamepad1.left_stick_x;  // Strafe power
double rx = gamepad1.right_stick_x; // Rotation power

// Calculate wheel powers
double frontLeftPower = y + x + rx;
double backLeftPower = y - x + rx;
double frontRightPower = y - x - rx;
double backRightPower = y + x - rx;
```

<br>

---

## Field Centric Driving

Field Centric driving makes the robot move relative to the **field**, not itself. Pushing forward on the stick will make the robot move away from you, regardless of which way it is facing.

### Why use Field Centric?
- **Easier for Drivers:** No need to compensate for the robot's orientation.
- **Consistent Control:** The robot always behaves the same way relative to the driver's perspective.

### The Implementation (using IMU):

```java
// Read the robot's heading from the IMU
double botHeading = imu.getRobotYawPitchRollAngles().getYaw(AngleUnit.RADIANS);

// Rotate the input vector by the negative of the robot's heading
double rotX = x * Math.cos(-botHeading) - y * Math.sin(-botHeading);
double rotY = x * Math.sin(-botHeading) + y * Math.cos(-botHeading);

// Now apply the rotated powers (rotX and rotY) instead of raw x and y
double fl = rotY + rotX + rx;
double bl = rotY - rotX + rx;
double fr = rotY - rotX - rx;
double br = rotY + rotX - rx;
```

<br>

---

## Standard Drive Functions

When programming your drivetrain, ensure you normalize the motor powers so that no single value exceeds 1.0, which would cause inconsistent movements.

```java
// Find the maximum value among the four powers
double max = Math.max(Math.abs(fl), Math.max(Math.abs(bl),
             Math.max(Math.abs(fr), Math.abs(br))));

// If the max is greater than 1.0, scale them all down
if (max > 1.0) {
    fl /= max;
    bl /= max;
    fr /= max;
    br /= max;
}

// Apply the powers to the motors
frontLeft.setPower(fl);
backLeft.setPower(bl);
frontRight.setPower(fr);
backRight.setPower(br);
```
