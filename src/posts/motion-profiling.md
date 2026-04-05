---
title: Motion Profiling
date: 2026-03-28
description: Learn how to use trapezoidal motion profiling with FTC drivetrains and single‑motor mechanisms.
tags: [completed, software, advanced, novideo]
author: Blueprint
published: true
---

# Motion Profiling

Motion profiling is a technique for moving motors smoothly by limiting not just maximum speed, but also acceleration and deceleration. In FTC, this is especially valuable for **drivetrains** and **single‑motor mechanisms** like arms or slides, because it reduces wheel slip, lowers mechanical stress, and improves positional repeatability.

---

## Why profile a drivetrain?

On a 4‑motor FTC drivetrain, slamming full power into the motors from rest can cause the wheels to break traction and skid. Motion profiling instead shapes the _target_ velocity (or position) so that the drivetrain accelerates and decelerates smoothly, which keeps the wheels rolling cleanly and makes autonomous and driver‑controlled motion more predictable.

<br>

## What is a trapezoid profile?

A **trapezoidal motion profile** has three phases:

- **Acceleration:** velocity ramps up from 0 to a maximum.
- **Cruise:** velocity stays constant.
- **Deceleration:** velocity ramps back down to 0.

The velocity vs. time graph looks like a trapezoid if the robot reaches max speed before slowing; if the distance is too short, the cruise phase disappears and you get a **triangular** profile. For most FTC drivetrain moves, trapezoidal profiles work well because they are simple and smooth.

<br>

## How profiling helps drivetrains

Instead of telling your PID controller “go to 3000 encoder ticks right now,” you tell it “here is the ideal position, velocity, and acceleration at this moment.” The profile becomes the _reference trajectory_, and the controller follows it. This approach is used in libraries like Road Runner and can be adapted to your own drivetrain code.

---

## Core kinematics

At the heart of trapezoidal motion profiling are basic constant‑acceleration equations:

$$v = v_0 + a \cdot t$$
$$x = x_0 + v_0 \cdot t + \tfrac{1}{2} a \cdot t^2$$

These equations let you compute the target position and velocity for each time step along the profile.

---

# Example 1: Single‑motor mechanism

This example shows a simple trapezoidal motion profile for a **single DcMotorEx** (e.g., an arm or slide) using a custom profile generator rather than a full library like Road Runner. The controller is PIDF‑based, and the profile is computed inline.

```java
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.hardware.DcMotorEx;
import com.qualcomm.robotcore.hardware.PIDCoefficients;
import com.qualcomm.robotcore.util.ElapsedTime;
import com.qualcomm.robotcore.util.Range;

public class SingleMotorProfile extends LinearOpMode {
    private DcMotorEx motor;
    private final ElapsedTime timer = new ElapsedTime();

    // control target
    private double startPos;
    private double targetPos = 2000; // encoder ticks

    // profile limits
    private double maxVel     = 1800; // ticks/sec
    private double maxAccel   = 2400; // ticks/sec^2

    // PID controller
    private PIDCoefficients pid = new PIDCoefficients(0.01, 0.0, 0.0004);
    private PIDController controller;

    @Override
    public void runOpMode() throws InterruptedException {
        // hardware setup
        motor = hardwareMap.get(DcMotorEx.class, "arm");
        motor.setMode(DcMotor.RunMode.STOP_AND_RESET_ENCODER);
        motor.setMode(DcMotor.RunMode.RUN_USING_ENCODER);
        motor.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);

        controller = new PIDController(pid.p, pid.i, pid.d);

        waitForStart();
        startPos = motor.getCurrentPosition();
        timer.reset();

        while (opModeIsActive()) {
            double t = timer.seconds();
            double error = targetPos - startPos;

            // compute acceleration time and distance
            double tAccel = maxVel / maxAccel;
            double dAccel = 0.5 * maxAccel * tAccel * tAccel;

            double setpoint, cmdVel;

            // check if move is too short for cruise
            if (Math.abs(error) < 2 * dAccel) {
                double tPeak = Math.sqrt(Math.abs(error) / maxAccel);
                double sign = Math.signum(error);

                if (t < tPeak) {
                    cmdVel    = maxAccel * t * sign;
                    setpoint  = startPos + 0.5 * maxAccel * t * t * sign;
                } else if (t < 2 * tPeak) {
                    double td = t - tPeak;
                    cmdVel    = maxAccel * (tPeak - td) * sign;
                    setpoint  = startPos
                              + (0.5 * maxAccel * tPeak * tPeak
                              + maxAccel * tPeak * td
                              - 0.5 * maxAccel * td * td) * sign;
                } else {
                    cmdVel   = 0;
                    setpoint = targetPos;
                }
            } else {
                double sign = Math.signum(error);
                double dCruise = Math.abs(error) - 2 * dAccel;
                double tCruise = dCruise / maxVel;

                if (t < tAccel) {
                    cmdVel   = maxAccel * t * sign;
                    setpoint = startPos + 0.5 * maxAccel * t * t * sign;
                } else if (t < tAccel + tCruise) {
                    double tc = t - tAccel;
                    cmdVel   = maxVel * sign;
                    setpoint = startPos + (dAccel + maxVel * tc) * sign;
                } else if (t < 2 * tAccel + tCruise) {
                    double td = t - tAccel - tCruise;
                    cmdVel   = (maxVel - maxAccel * td) * sign;
                    setpoint = startPos
                             + (dAccel + dCruise
                              + maxVel * td
                              - 0.5 * maxAccel * td * td) * sign;
                } else {
                    cmdVel   = 0;
                    setpoint = targetPos;
                }
            }

            // update PID with trapezoidal profile
            controller.setPID(pid.p, pid.i, pid.d);
            controller.setSetpoint(setpoint);
            double output = controller.calculate(motor.getCurrentPosition());

            motor.setPower(Range.clip(output, -1.0, 1.0));

            telemetry.addData("targetPos", "%.1f", setpoint);
            telemetry.addData("targetVel", "%.1f", cmdVel);
            telemetry.addData("currentPos", "%.1f", motor.getCurrentPosition());
            telemetry.addData("motorPower", "%.3f", motor.getPower());
            telemetry.update();
        }
    }
}
```

This example implements a **trapezoidal profile by hand** and then feeds the computed position setpoint into a PID loop; the controller adds correction to follow the profile.

---

# Example 2: 4‑motor drivetrain (tank‑style)

For a **4‑motor tank drivetrain**, you can apply the same trapezoidal idea to each side. The profile is generated once, and then the position and velocity are sent to both left and right sides. This keeps the robot driving straight while still profiling acceleration and deceleration.

Below is a simplified FTC‑style example using `RUN_USING_ENCODER` on each side of the drivetrain. In practice, you can wrap left and right into arrays or a `DriveTrain` class.

```java
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.hardware.DcMotorEx;
import com.qualcomm.robotcore.hardware.PIDCoefficients;
import com.qualcomm.robotcore.util.ElapsedTime;
import com.qualcomm.robotcore.util.Range;

public class DrivetrainProfile extends LinearOpMode {
    DcMotorEx leftFront, leftBack, rightFront, rightBack;
    ElapsedTime timer = new ElapsedTime();

    // move target (in encoder ticks per side)
    private double startPosLeft;
    private double startPosRight;
    private double targetPos = 3000; // straight forward

    // profile limits
    private double maxVel   = 1500; // ticks/sec
    private double maxAccel = 2000; // ticks/sec^2

    // PID for each side
    private PIDCoefficients pid  = new PIDCoefficients(0.01, 0.0, 0.0004);
    private PIDController leftController   = new PIDController(pid.p, pid.i, pid.d);
    private PIDController rightController  = new PIDController(pid.p, pid.i, pid.d);

    @Override
    public void runOpMode() throws InterruptedException {
        // hardware setup
        leftFront  = hardwareMap.get(DcMotorEx.class, "leftFront");
        leftBack   = hardwareMap.get(DcMotorEx.class, "leftBack");
        rightFront = hardwareMap.get(DcMotorEx.class, "rightFront");
        rightBack  = hardwareMap.get(DcMotorEx.class, "rightBack");

        leftFront.setMode(DcMotor.RunMode.STOP_AND_RESET_ENCODER);
        leftBack.setMode(DcMotor.RunMode.STOP_AND_RESET_ENCODER);
        rightFront.setMode(DcMotor.RunMode.STOP_AND_RESET_ENCODER);
        rightBack.setMode(DcMotor.RunMode.STOP_AND_RESET_ENCODER);

        leftFront.setMode(DcMotor.RunMode.RUN_USING_ENCODER);
        leftBack.setMode(DcMotor.RunMode.RUN_USING_ENCODER);
        rightFront.setMode(DcMotor.RunMode.RUN_USING_ENCODER);
        rightBack.setMode(DcMotor.RunMode.RUN_USING_ENCODER);

        leftFront.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);
        leftBack.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);
        rightFront.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);
        rightBack.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);

        waitForStart();
        startPosLeft  = (leftFront.getCurrentPosition()  + leftBack.getCurrentPosition())  / 2.0;
        startPosRight = (rightFront.getCurrentPosition() + rightBack.getCurrentPosition()) / 2.0;
        timer.reset();

        while (opModeIsActive()) {
            double t = timer.seconds();
            double leftError  = targetPos - startPosLeft;
            double rightError = targetPos - startPosRight;

            double tAccel = maxVel / maxAccel;
            double dAccel = 0.5 * maxAccel * tAccel * tAccel;

            double leftSetpoint, rightSetpoint, leftVel, rightVel;

            for (int side = 0; side < 2; side++) {
                double error = (side == 0) ? leftError : rightError;
                boolean isLeft = (side == 0);

                if (Math.abs(error) < 2 * dAccel) {
                    double tPeak = Math.sqrt(Math.abs(error) / maxAccel);
                    double sign  = Math.signum(error);

                    if (t < tPeak) {
                        if (isLeft) {
                            leftVel    = maxAccel * t * sign;
                            leftSetpoint = startPosLeft + 0.5 * maxAccel * t * t * sign;
                        } else {
                            rightVel   = maxAccel * t * sign;
                            rightSetpoint = startPosRight + 0.5 * maxAccel * t * t * sign;
                        }
                    } else if (t < 2 * tPeak) {
                        double td = t - tPeak;
                        if (isLeft) {
                            leftVel = maxAccel * (tPeak - td) * sign;
                            leftSetpoint = startPosLeft
                                         + (0.5 * maxAccel * tPeak * tPeak
                                          + maxAccel * tPeak * td
                                          - 0.5 * maxAccel * td * td) * sign;
                        } else {
                            rightVel = maxAccel * (tPeak - td) * sign;
                            rightSetpoint = startPosRight
                                          + (0.5 * maxAccel * tPeak * tPeak
                                           + maxAccel * tPeak * td
                                           - 0.5 * maxAccel * td * td) * sign;
                        }
                    } else {
                        if (isLeft) {
                            leftVel      = 0;
                            leftSetpoint = targetPos;
                        } else {
                            rightVel     = 0;
                            rightSetpoint = targetPos;
                        }
                    }
                } else {
                    double sign     = Math.signum(error);
                    double dCruise  = Math.abs(error) - 2 * dAccel;
                    double tCruise  = dCruise / maxVel;

                    if (t < tAccel) {
                        if (isLeft) {
                            leftVel   = maxAccel * t * sign;
                            leftSetpoint = startPosLeft + 0.5 * maxAccel * t * t * sign;
                        } else {
                            rightVel  = maxAccel * t * sign;
                            rightSetpoint = startPosRight + 0.5 * maxAccel * t * t * sign;
                        }
                    } else if (t < tAccel + tCruise) {
                        double tc = t - tAccel;
                        if (isLeft) {
                            leftVel   = maxVel * sign;
                            leftSetpoint = startPosLeft + (dAccel + maxVel * tc) * sign;
                        } else {
                            rightVel  = maxVel * sign;
                            rightSetpoint = startPosRight + (dAccel + maxVel * tc) * sign;
                        }
                    } else if (t < 2 * tAccel + tCruise) {
                        double td = t - tAccel - tCruise;
                        if (isLeft) {
                            leftVel = (maxVel - maxAccel * td) * sign;
                            leftSetpoint = startPosLeft
                                         + (dAccel + dCruise
                                          + maxVel * td
                                          - 0.5 * maxAccel * td * td) * sign;
                        } else {
                            rightVel = (maxVel - maxAccel * td) * sign;
                            rightSetpoint = startPosRight
                                          + (dAccel + dCruise
                                           + maxVel * td
                                           - 0.5 * maxAccel * td * td) * sign;
                        }
                    } else {
                        if (isLeft) {
                            leftVel      = 0;
                            leftSetpoint = targetPos;
                        } else {
                            rightVel     = 0;
                            rightSetpoint = targetPos;
                        }
                    }
                }
            }

            // update left PID
            leftController.setPID(pid.p, pid.i, pid.d);
            leftController.setSetpoint(leftSetpoint);
            double leftOutput = leftController.calculate(
                (leftFront.getCurrentPosition() + leftBack.getCurrentPosition()) / 2.0
            );

            // update right PID
            rightController.setPID(pid.p, pid.i, pid.d);
            rightController.setSetpoint(rightSetpoint);
            double rightOutput = rightController.calculate(
                (rightFront.getCurrentPosition() + rightBack.getCurrentPosition()) / 2.0
            );

            // send to all four motors
            leftFront.setPower(Range.clip(leftOutput, -1.0, 1.0));
            leftBack.setPower(Range.clip(leftOutput, -1.0, 1.0));
            rightFront.setPower(Range.clip(rightOutput, -1.0, 1.0));
            rightBack.setPower(Range.clip(rightOutput, -1.0, 1.0));

            telemetry.addData("leftTarget", "%.1f", leftSetpoint);
            telemetry.addData("rightTarget", "%.1f", rightSetpoint);
            telemetry.addData("leftPos", "%.1f", (leftFront.getCurrentPosition() + leftBack.getCurrentPosition()) / 2.0);
            telemetry.addData("rightPos", "%.1f", (rightFront.getCurrentPosition() + rightBack.getCurrentPosition()) / 2.0);
            telemetry.addData("leftPower", "%.3f", leftOutput);
            telemetry.addData("rightPower", "%.3f", rightOutput);
            telemetry.update();
        }
    }

    // simple PID helper if you don't have a full PIDFController
    static class PIDController {
        private double kP, kI, kD;
        private double lastError, integral;
        private double setpoint;

        public PIDController(double p, double i, double d) {
            kP = p; kI = i; kD = d;
        }

        public void setPID(double p, double i, double d) {
            kP = p; kI = i; kD = d;
        }

        public void setSetpoint(double s) {
            setpoint = s;
        }

        public double calculate(double measurement) {
            double error = setpoint - measurement;
            integral += error;
            double derivative = error - lastError;
            lastError = error;

            return kP * error + kI * integral + kD * derivative;
        }
    }
}
```

This example uses the **same trapezoid profile logic** on both left and right sides of a 4‑motor tank drivetrain, and then applies a basic PID controller to keep each side aligned with the profile.

---

## Notes and tuning tips

- Start with low `maxVel` and `maxAccel` and increase only after the robot moves smoothly.
- If the robot skips or slips, reduce acceleration first, not just velocity.
- Use `RUN_USING_ENCODER` on all drivetrain motors so the controller can see velocity and position.
