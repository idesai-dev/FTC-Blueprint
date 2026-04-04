---
title: Basics of Motors and Servos
date: 2026-03-28
description: Programming guide for DC motors and servos in FTC.
tags: [software, beginner, completed]
author: Ishaan Desai
published: true
---

Motors and servos are the primary actuators of an FTC robot. This guide covers how to program them in Java using the FTC Robot Controller app.

## DC Motors

DC motors provide the power for your drivetrain and other mechanisms like arms or linear slides.

### 1. Initialization

Use the `hardwareMap` to initialize your motor.

```java
DcMotor leftDrive = hardwareMap.get(DcMotor.class, "leftDrive");
```

### 2. Setting Direction

Depending on how your motor is oriented, you might need to reverse its direction.

```java
leftDrive.setDirection(DcMotor.Direction.REVERSE);
```

### 3. Basic Control

You can control the motor's power from -1.0 to 1.0.

```java
leftDrive.setPower(0.5); // 50% power forward
```

### 4. Zero Power Behavior

Choose how the motor should behave when power is set to zero.

- **Brake:** Resists movement (better for precision).
- **Float:** Free to spin (better for some intakes).

```java
leftDrive.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);
```

---

## Servos

Servos are used for precision movements, like grippers or small rotations.

### 1. Standard Servos

Standard servos move to a specific position from 0.0 to 1.0.

```java
Servo gripper = hardwareMap.get(Servo.class, "gripper");
gripper.setPosition(0.5); // Move to the middle position
```

### 2. Continuous Rotation (CR) Servos

CR servos rotate continuously and are controlled like a DC motor.

```java
CRServo intake = hardwareMap.get(CRServo.class, "intake");
intake.setPower(1.0); // Full speed forward
```

- **Testing:** Use a simple test OpMode (like the FTC Dashboard servo test) to find the correct positions and directions for your motors and servos.
