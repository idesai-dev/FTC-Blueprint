import{a as c,f as l}from"./DDp7itWI.js";import"./Bj71fZwK.js";import{ai as t,aj as u,ak as o,ah as i}from"./BmOK0Sn6.js";import{h as e}from"./DBI5q98Z.js";const r={title:"NextFTC Subsystems",date:"2026-03-28T00:00:00.000Z",description:"Building modular and reusable robot mechanisms using the NextFTC framework.",tags:["software","intermediate"],author:"Ishaan Desai",published:!0},{title:y,date:w,description:b,tags:g,author:v,published:T}=r;var k=l('<p>NextFTC is a powerful command-based framework for FTC that helps you organize your robot code into <strong>Subsystems</strong> and <strong>Commands</strong>. This makes your code more modular, easier to test, and prevents hardware conflicts.</p> <h2>What is a Subsystem?</h2> <p>A subsystem is a class that represents a physical mechanism on your robot (e.g., an Arm, an Intake, or a Lift). It contains the hardware objects (motors, servos) and the basic methods to control them.</p> <h3>Creating a Subsystem</h3> <p>In NextFTC, every subsystem should implement the <code>Subsystem</code> interface. We also recommend using the <strong>Singleton</strong> pattern to ensure you only have one instance of each mechanism.</p> <pre class="language-java"></pre> <h2>Creating Commands</h2> <p>Commands are the actions your subsystems perform. For example, <code>LiftToPosition</code> or <code>IntakeCollect</code>.</p> <pre class="language-java"></pre> <h2>Why This is Better</h2> <ul><li><strong>Automatic Conflict Resolution:</strong> If you try to run two commands that both require the <code>Lift</code>, NextFTC will automatically stop the old one and start the new one.</li> <li><strong>Cleaner OpModes:</strong> Your OpModes become a simple list of commands rather than a mess of loops and state variables.</li> <li><strong>Reusability:</strong> You can easily reuse your subsystems and commands across different autonomous and TeleOp routines.</li></ul>',1);function C(p){var n=k(),s=t(u(n),10);e(s,()=>`<code class="language-java"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Lift</span> <span class="token keyword">implements</span> <span class="token class-name">Subsystem</span> <span class="token punctuation">&#123;</span>
    <span class="token comment">// Singleton instance</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">Lift</span> <span class="token constant">INSTANCE</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Lift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    
    <span class="token keyword">private</span> <span class="token class-name">MotorEx</span> liftMotor<span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token class-name">Lift</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">&#123;</span>
        <span class="token comment">// Private constructor for Singleton</span>
    <span class="token punctuation">&#125;</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">initialize</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">&#123;</span>
        liftMotor <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MotorEx</span><span class="token punctuation">(</span><span class="token string">"liftMotor"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        liftMotor<span class="token punctuation">.</span><span class="token function">setRunMode</span><span class="token punctuation">(</span><span class="token class-name">Motor<span class="token punctuation">.</span>RunMode</span><span class="token punctuation">.</span><span class="token constant">RUN_USING_ENCODER</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">&#125;</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">periodic</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">&#123;</span>
        <span class="token comment">// This runs every single loop</span>
        <span class="token comment">// Perfect for PID updates or safety checks</span>
    <span class="token punctuation">&#125;</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setPower</span><span class="token punctuation">(</span><span class="token keyword">double</span> power<span class="token punctuation">)</span> <span class="token punctuation">&#123;</span>
        liftMotor<span class="token punctuation">.</span><span class="token function">setPower</span><span class="token punctuation">(</span>power<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">&#125;</span>
<span class="token punctuation">&#125;</span></code>`,!0),o(s);var a=t(s,6);e(a,()=>`<code class="language-java"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">LiftToTop</span> <span class="token keyword">extends</span> <span class="token class-name">Command</span> <span class="token punctuation">&#123;</span>
    <span class="token keyword">public</span> <span class="token class-name">LiftToTop</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">&#123;</span>
        <span class="token comment">// Tell the scheduler this command needs the Lift</span>
        <span class="token keyword">requires</span><span class="token punctuation">(</span><span class="token class-name">Lift</span><span class="token punctuation">.</span><span class="token constant">INSTANCE</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">&#125;</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">initialize</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">&#123;</span>
        <span class="token class-name">Lift</span><span class="token punctuation">.</span><span class="token constant">INSTANCE</span><span class="token punctuation">.</span><span class="token function">setPower</span><span class="token punctuation">(</span><span class="token number">0.8</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">&#125;</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">isFinished</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">&#123;</span>
        <span class="token comment">// Return true when the lift reaches the target</span>
        <span class="token keyword">return</span> <span class="token class-name">Lift</span><span class="token punctuation">.</span><span class="token constant">INSTANCE</span><span class="token punctuation">.</span><span class="token function">isAtTop</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">&#125;</span>
<span class="token punctuation">&#125;</span></code>`,!0),o(a),i(4),c(p,n)}export{C as default,r as metadata};
