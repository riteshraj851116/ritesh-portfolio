import { useState, useRef } from "react";
import { Terminal as TerminalIcon, Play, CheckCircle2, Activity } from "lucide-react";
import { playClickSound, playHoverSound, playSuccessSound } from "../utils/audio";
import "./TerminalSimulator.css";

const COMMAND_PRESETS = [
  {
    cmd: "curl /api/jobsphere/match",
    label: "JOBSPHERE REST API",
    tag: "SOCKET.IO",
  },
  {
    cmd: "mongo /teracar/filter?available=true",
    label: "MONGOOSE INDEX QUERY",
    tag: "<200MS",
  },
  {
    cmd: "ws://jobsphere:8080/chat/handshake",
    label: "WEBSOCKET LATENCY",
    tag: "SUB-50MS",
  },
  {
    cmd: "cat /credentials/status",
    label: "ENGINEER METRICS",
    tag: "MERN",
  },
];

const RESPONSES = {
  "curl /api/jobsphere/match": {
    status: "HTTP/1.1 200 OK",
    headers: { "Content-Type": "application/json", "X-Latency": "42ms", "Auth": "Bearer JWT.Verified" },
    payload: {
      platform: "JobSphere",
      activeRecruiters: 84,
      liveCandidates: 1420,
      socketChannels: "Connected (TLS 1.3)",
      pipeline: "ATS Automatic Candidate Scoring (100% Secure)",
      endpoints: "40+ Modular REST routes loaded",
    },
  },
  "mongo /teracar/filter?available=true": {
    status: "MONGOOSE AGGREGATION PIPELINE SUCCESS",
    headers: { "ExecutionTime": "148ms", "IndexScan": "IXSCAN [status_1_rate_1]", "DocsExamined": 18 },
    payload: {
      fleetSize: 120,
      availableVehicles: 46,
      averageBookingLatency: "1.2s",
      adminDashboardComponents: "15+ Reusable React Components",
      securityMiddleware: ["Helmet", "RateLimit", "JWTGuard"],
    },
  },
  "ws://jobsphere:8080/chat/handshake": {
    status: "UPGRADE: WEBSOCKET [101 SWITCHING PROTOCOLS]",
    headers: { "Transport": "websocket", "Engine": "Socket.IO v4", "Heartbeat": "25000ms" },
    payload: {
      connectionId: "ws_live_9983x",
      bidirectionalLatency: "38ms",
      encryption: "AES-256 GCM",
      activeRooms: 34,
      messageLossRate: "0.00%",
    },
  },
  "cat /credentials/status": {
    status: "RITESH RAJ // FULL STACK PROFILE TELEMETRY",
    headers: { "Degree": "B.Tech CSE (Galgotias University, 2023-2027)", "CGPA": "7.3/10" },
    payload: {
      certifications: [
        "CodeHelp Babbar — MERN Stack Web Development (150+ hrs)",
        "Apna College — Java Data Structures & Algorithms (200+ Solved)",
      ],
      coreStrengths: ["React 19", "Node.js", "Express.js", "MongoDB", "Socket.IO", "Three.js", "GSAP"],
      contact: {
        phone: "+91-9709721676",
        email: "riteshraj851116@gmail.com",
        github: "https://github.com/riteshraj851116",
        linkedin: "https://www.linkedin.com/in/ritesh-raj-9b52162a7/",
      },
    },
  },
};

const TerminalSimulator = () => {
  const [activeCmd, setActiveCmd] = useState(COMMAND_PRESETS[0].cmd);
  const [output, setOutput] = useState(RESPONSES[COMMAND_PRESETS[0].cmd]);
  const [isExecuting, setIsExecuting] = useState(false);
  const consoleBottomRef = useRef(null);

  const runCommand = (cmd) => {
    playClickSound();
    setActiveCmd(cmd);
    setIsExecuting(true);

    setTimeout(() => {
      setOutput(RESPONSES[cmd] || { status: "Command executed", payload: {} });
      setIsExecuting(false);
      playSuccessSound();
    }, 280);
  };

  return (
    <section className="terminal-simulator-section" id="live-engine">
      <div className="terminal-header-strip">
        <div className="terminal-title-row">
          <span className="terminal-tag-num">04.1 // LIVE ARCHITECTURE ENGINE</span>
          <span className="terminal-status-live">
            <span className="terminal-live-dot"></span>
            INTERACTIVE RUNTIME
          </span>
        </div>
        <p className="terminal-desc">
          Test live simulated endpoints across JobSphere, VeloceDrive, and Socket.IO microservices.
        </p>
      </div>

      <div className="terminal-window">
        {/* WINDOW TITLE BAR */}
        <div className="terminal-topbar">
          <div className="terminal-dots">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>

          <div className="terminal-title">
            <TerminalIcon size={12} />
            <span>ritesh@mernhost:~/api-cluster</span>
          </div>

          <div className="terminal-latency">
            <Activity size={12} className="pulse-icon" />
            <span>PING: 38MS</span>
          </div>
        </div>

        {/* QUICK COMMAND SELECTORS */}
        <div className="terminal-presets-bar">
          <span className="presets-label">EXECUTABLE PROTOCOLS:</span>
          <div className="presets-list">
            {COMMAND_PRESETS.map((preset) => (
              <button
                key={preset.cmd}
                className={`preset-btn ${activeCmd === preset.cmd ? "active" : ""}`}
                onClick={() => runCommand(preset.cmd)}
                onMouseEnter={playHoverSound}
              >
                <Play size={10} className="play-icon" />
                <span className="preset-name">{preset.label}</span>
                <span className="preset-tag">{preset.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CONSOLE SCREEN */}
        <div className="terminal-screen">
          <div className="console-prompt-line">
            <span className="console-user">guest@ritesh-system</span>
            <span className="console-arrow">:~$</span>
            <span className="console-cmd">{activeCmd}</span>
            {isExecuting && <span className="console-cursor blink">█</span>}
          </div>

          {isExecuting ? (
            <div className="console-executing">
              <span className="spin-dash">/</span> Executing remote cluster request...
            </div>
          ) : (
            output && (
              <div className="console-result">
                <div className="result-status">
                  <CheckCircle2 size={13} className="status-icon" />
                  <span>{output.status}</span>
                </div>

                {output.headers && (
                  <div className="result-headers">
                    {Object.entries(output.headers).map(([k, v]) => (
                      <span key={k} className="header-badge">
                        <strong>{k}:</strong> {v}
                      </span>
                    ))}
                  </div>
                )}

                <pre className="result-json">
                  <code>{JSON.stringify(output.payload, null, 2)}</code>
                </pre>
              </div>
            )
          )}
          <div ref={consoleBottomRef} />
        </div>
      </div>
    </section>
  );
};

export default TerminalSimulator;
