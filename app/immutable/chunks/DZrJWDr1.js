const e=`---\r
title: NextFTC Subsystems\r
date: 2026-03-28\r
description: Building modular and reusable robot mechanisms using the NextFTC framework.\r
tags: [software, intermediate, command-based]\r
author: Ishaan Desai\r
published: true\r
---\r
\r
NextFTC is a powerful command-based framework for FTC that helps you organize your robot code into **Subsystems** and **Commands**. This makes your code more modular, easier to test, and prevents hardware conflicts.\r
\r
## What is a Subsystem?\r
A subsystem is a class that represents a physical mechanism on your robot (e.g., an Arm, an Intake, or a Lift). It contains the hardware objects (motors, servos) and the basic methods to control them.\r
\r
### Creating a Subsystem\r
In NextFTC, every subsystem should implement the \`Subsystem\` interface. We also recommend using the **Singleton** pattern to ensure you only have one instance of each mechanism.\r
\r
\`\`\`java\r
public class Lift implements Subsystem {\r
    // Singleton instance\r
    public static final Lift INSTANCE = new Lift();\r
    \r
    private MotorEx liftMotor;\r
\r
    private Lift() {\r
        // Private constructor for Singleton\r
    }\r
\r
    @Override\r
    public void initialize() {\r
        liftMotor = new MotorEx("liftMotor");\r
        liftMotor.setRunMode(Motor.RunMode.RUN_USING_ENCODER);\r
    }\r
\r
    @Override\r
    public void periodic() {\r
        // This runs every single loop\r
        // Perfect for PID updates or safety checks\r
    }\r
\r
    public void setPower(double power) {\r
        liftMotor.setPower(power);\r
    }\r
}\r
\`\`\`\r
\r
## Creating Commands\r
Commands are the actions your subsystems perform. For example, \`LiftToPosition\` or \`IntakeCollect\`.\r
\r
\`\`\`java\r
public class LiftToTop extends Command {\r
    public LiftToTop() {\r
        // Tell the scheduler this command needs the Lift\r
        requires(Lift.INSTANCE);\r
    }\r
\r
    @Override\r
    public void initialize() {\r
        Lift.INSTANCE.setPower(0.8);\r
    }\r
\r
    @Override\r
    public boolean isFinished() {\r
        // Return true when the lift reaches the target\r
        return Lift.INSTANCE.isAtTop();\r
    }\r
}\r
\`\`\`\r
\r
## Why This is Better\r
- **Automatic Conflict Resolution:** If you try to run two commands that both require the \`Lift\`, NextFTC will automatically stop the old one and start the new one.\r
- **Cleaner OpModes:** Your OpModes become a simple list of commands rather than a mess of loops and state variables.\r
- **Reusability:** You can easily reuse your subsystems and commands across different autonomous and TeleOp routines.\r
`;export{e as default};
