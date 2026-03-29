const e=`---\r
title: Types of OpModes\r
date: 2026-03-28\r
description: The core differences between an OpMode and a LinearOpMode with Java examples.\r
tags: [software, beginner, video]\r
author: Ishaan Desai\r
published: true\r
---\r
\r
In the FTC SDK, there are two primary classes you can inherit from to write your robot controller programs: \`OpMode\` and \`LinearOpMode\`. Choosing which one to use depends on how you want to structure your code and logic.\r
\r
## OpMode\r
An \`OpMode\` (often called an Iterative OpMode) acts like a state machine. It has specific methods (\`init()\`, \`init_loop()\`, \`start()\`, \`loop()\`, and \`stop()\`) that are repeatedly called by the system in a non-blocking loop. \r
You must avoid using loops like \`while()\` or \`Thread.sleep()\` inside \`loop()\`, because it will freeze the robot and crash the app.\r
\r
## Linear OpMode\r
A \`LinearOpMode\` runs your code linearly from top to bottom. Everything happens inside a single \`runOpMode()\` method. To keep the program running continuously throughout the match, you must manually use a loop (usually \`while (opModeIsActive())\`). It's easier for beginners to grasp because it acts like a traditional linear program and permits blocking code (like \`sleep()\`).\r
\r
## The Difference in Code\r
\r
Here is a side-by-side comparison of a simple robot waiting for start and then driving forward. Notice the structural and syntax differences between the two.\r
\r
\`\`\`java\r
// ITERATIVE OPMODE EXAMPLE\r
@TeleOp(name="Basic Iterative")\r
public class BasicIterative extends OpMode {\r
    DcMotor motor;\r
\r
    @Override\r
    public void init() {\r
        motor = hardwareMap.get(DcMotor.class, "motor");\r
    }\r
\r
    @Override\r
    public void loop() {\r
        // This repeatedly runs incredibly fast! No while loops here.\r
        motor.setPower(1.0);\r
    }\r
}\r
\`\`\`\r
\r
\`\`\`java\r
// LINEAR OPMODE EXAMPLE \r
@TeleOp(name="Basic Linear")\r
public class BasicLinear extends LinearOpMode {\r
    DcMotor motor;\r
\r
    @Override\r
    public void runOpMode() throws InterruptedException {\r
        // 1. Initialization code\r
        motor = hardwareMap.get(DcMotor.class, "motor");\r
        \r
        // 2. Wait for the play button\r
        waitForStart();\r
\r
        // 3. Loop while the match is running\r
        while (opModeIsActive()) {\r
            motor.setPower(1.0);\r
        }\r
    }\r
}\r
\`\`\`\r
`;export{e as default};
