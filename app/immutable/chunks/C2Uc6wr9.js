const e=`---\r
title: Android Studio Setup\r
date: 2026-03-28\r
description: Complete set up guide for Android Studio on both Windows and Mac.\r
tags: [software, manual, beginner, completed guide]\r
author: Ishaan Desai\r
published: true\r
---\r
\r
This guide will walk you through setting up Android Studio for your FTC Robot Controller projects. It is essential to get your development environment properly installed and configured to begin writing and deploying Opmode code.\r
\r
## Windows Setup\r
\r
To install Android Studio on a Windows machine:\r
1. Visit the [Android Studio Download page](https://developer.android.com/studio).\r
2. Download the executable installer for Windows.\r
3. Once downloaded, run the installer and ensure you check the options for "Android SDK" and "Android Virtual Device" if prompted.\r
4. Follow the setup wizard, accepting the default locations.\r
5. Clone or download your desired FTC SDK repository and open the folder from the Android Studio splash screen.\r
6. The IDE will take some time to fetch Gradle dependencies. Once the build finishes and syncs, you're ready to start programming.\r
\r
## Mac Setup\r
\r
To install Android Studio on a macOS machine:\r
1. Visit the [Android Studio Download page](https://developer.android.com/studio).\r
2. Choose the download button for your processor type (Intel or Apple Silicon).\r
3. Once downloaded, open the \`.dmg\` file and drag the Android Studio icon into the Applications folder.\r
4. Open the application. On first launch, Android Studio will present a Setup Wizard. Like on Windows, proceed with standard choices, letting it download the necessary SDK platforms.\r
5. Open your cloned FTC SDK directory via the Welcome window (\`Open...\`).\r
6. After establishing the project structure and finishing gradle indexing, your setup is complete.\r
\r
_Ensure that you have set up ADB (Android Debug Bridge) or allowed sufficient permissions for your OS to detect your Rev Control Hub over Wi-Fi or USB!_\r
`;export{e as default};
