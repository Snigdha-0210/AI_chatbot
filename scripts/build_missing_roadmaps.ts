import fs from 'fs';
import path from 'path';

const ROADMAP_DIR = path.join(process.cwd(), 'data', 'roadmaps');

if (!fs.existsSync(ROADMAP_DIR)) {
  fs.mkdirSync(ROADMAP_DIR, { recursive: true });
}

function createRoadmap(roleId: string, title: string, stages: any[]) {
  const data = {
    roleId,
    title,
    demand: "High",
    estimatedMonths: 6,
    stages,
    toolStack: {
      "Core Technologies": ["Git", "Docker"],
      "Development Tools": ["VS Code", "Postman"]
    }
  };
  fs.writeFileSync(path.join(ROADMAP_DIR, `${roleId}.json`), JSON.stringify(data, null, 2));
}

// Helper to create basic skill objects
const s = (name: string, subtopics: string[], estimatedHours: number = 20) => ({
  name,
  category: "Core",
  difficulty: "Intermediate",
  estimatedHours,
  importanceScore: 9,
  prerequisites: [],
  subtopics,
  miniProject: {
    name: `${name} Implementation`,
    description: `Practical implementation of ${name} principles in a simulated environment.`
  },
  resources: []
});

const p = (name: string, description: string, skills: string[]) => ({
  name,
  difficulty: "Advanced",
  description,
  skillsApplied: skills
});

// QA Engineer
createRoadmap("qa_engineer", "QA Engineer", [
  {
    id: "foundations", title: "Foundations", description: "Core testing concepts.", estimatedWeeks: 4,
    skills: [
      s("Software Testing Basics", ["Manual Testing", "Bug Lifecycle", "SDLC", "STLC"]),
      s("Test Case Design", ["Equivalence Partitioning", "Boundary Value Analysis"]),
      s("Defect Tracking", ["Jira", "Bugzilla"])
    ]
  },
  {
    id: "core", title: "Core Skills", description: "Automation and API testing.", estimatedWeeks: 8,
    skills: [
      s("API Testing", ["Postman", "REST Assured"]),
      s("Automation Testing", ["Selenium", "Cypress"]),
      s("Performance Testing", ["JMeter", "Gatling"])
    ]
  },
  {
    id: "projects", title: "Advanced Projects", description: "Real-world testing suites.", estimatedWeeks: 6,
    projects: [
      p("Automation Testing Framework", "A complete data-driven automation framework.", ["Selenium", "Java"]),
      p("Cross Browser Testing Platform", "Automated tests across multiple browsers.", ["Cypress", "BrowserStack"]),
      p("API Testing Dashboard", "Comprehensive API testing and reporting.", ["Postman", "Newman", "React"]),
      p("Performance Testing Suite", "Load testing suite simulating 10k users.", ["JMeter", "Gatling"]),
      p("Visual Regression Testing Tool", "Automated UI comparison tool.", ["Playwright", "Applitools"]),
      p("Bug Analytics Platform", "Dashboard for tracking defect trends.", ["Python", "Grafana"]),
      p("CI/CD Testing Pipeline", "Automated testing in GitHub Actions.", ["Docker", "GitHub Actions"]),
      p("Enterprise QA Management System", "Internal tool for test case management.", ["Node", "React"])
    ]
  }
]);

// Database Engineer
createRoadmap("database_engineer", "Database Engineer", [
  {
    id: "foundations", title: "Foundations", description: "Database fundamentals.", estimatedWeeks: 4,
    skills: [
      s("SQL", ["Queries", "Joins", "Subqueries"]),
      s("Database Design", ["Normalization", "ER Diagrams", "Schema Design"]),
      s("Transactions", ["ACID Properties", "Isolation Levels"])
    ]
  },
  {
    id: "core", title: "Core Skills", description: "Advanced optimization.", estimatedWeeks: 8,
    skills: [
      s("Indexing", ["B-Trees", "Hash Indexes"]),
      s("Partitioning & Sharding", ["Horizontal", "Vertical"]),
      s("Replication", ["Master-Slave", "Multi-Master"]),
      s("Stored Procedures", ["Triggers", "Functions"])
    ]
  },
  {
    id: "projects", title: "Advanced Projects", description: "Large scale databases.", estimatedWeeks: 6,
    projects: [
      p("Distributed Database Simulator", "Simulating a distributed DB environment.", ["PostgreSQL", "Docker"]),
      p("Database Monitoring Platform", "Dashboard for DB health and query times.", ["Grafana", "Prometheus"]),
      p("SQL Query Optimizer", "Tool to analyze and suggest index strategies.", ["Python", "SQL"]),
      p("Analytics Data Warehouse", "Data warehouse for BI and OLAP.", ["Redshift", "ETL"]),
      p("Replication Management System", "Automated master-slave failover.", ["MySQL", "Bash"]),
      p("Database Backup Automation Tool", "Scheduled backups with disaster recovery.", ["AWS S3", "Cron"]),
      p("High Availability Cluster", "Setting up a multi-node Galera cluster.", ["MariaDB", "Linux"]),
      p("Multi-Tenant Database Architecture", "Row-level security for SaaS.", ["PostgreSQL", "RLS"])
    ]
  }
]);

// SRE Engineer
createRoadmap("sre_engineer", "SRE Engineer", [
  {
    id: "foundations", title: "Foundations", description: "System basics.", estimatedWeeks: 4,
    skills: [
      s("Linux", ["Command Line", "Permissions", "Bash Scripting"]),
      s("Networking", ["TCP/IP", "DNS", "Load Balancing"]),
      s("Cloud Basics", ["AWS", "GCP"])
    ]
  },
  {
    id: "core", title: "Core Skills", description: "Reliability practices.", estimatedWeeks: 8,
    skills: [
      s("Monitoring", ["Prometheus", "Grafana"]),
      s("Observability", ["Logging", "Tracing", "Metrics"]),
      s("Incident Management", ["Runbooks", "Postmortems"]),
      s("Reliability Engineering", ["SLIs", "SLOs", "Error Budgets"])
    ]
  },
  {
    id: "projects", title: "Advanced Projects", description: "SRE in practice.", estimatedWeeks: 6,
    projects: [
      p("Observability Platform", "Comprehensive system dashboard with tracing.", ["Grafana", "Prometheus", "Jaeger"]),
      p("Infrastructure Monitoring System", "Agent-based node monitoring.", ["Telegraf", "InfluxDB"]),
      p("Incident Response Dashboard", "Automated alerting and on-call rotation.", ["PagerDuty", "Python"]),
      p("Cloud Reliability Platform", "Chaos engineering testing suite.", ["Chaos Mesh", "Kubernetes"]),
      p("Kubernetes Monitoring Suite", "Deep cluster health analytics.", ["Kube-state-metrics", "ELK"]),
      p("Auto Scaling Engine", "Dynamic scaling based on custom metrics.", ["AWS Auto Scaling", "Terraform"]),
      p("Disaster Recovery Automation", "Automated cross-region failover scripts.", ["AWS Route53", "Lambda"]),
      p("Site Reliability Analytics Platform", "SLO/SLI error budget tracker.", ["React", "Go"])
    ]
  }
]);

// AR/VR Developer
createRoadmap("ar_vr_developer", "AR/VR Developer", [
  {
    id: "foundations", title: "Foundations", description: "3D and gaming basics.", estimatedWeeks: 4,
    skills: [
      s("Unity", ["Editor", "Scenes", "Prefabs"]),
      s("C#", ["Scripting", "OOP"]),
      s("3D Graphics", ["Meshes", "Textures", "Materials"]),
      s("Game Physics", ["Colliders", "Rigidbodies"])
    ]
  },
  {
    id: "core", title: "Core Skills", description: "XR SDKs.", estimatedWeeks: 8,
    skills: [
      s("ARCore", ["Tracking", "Anchors"]),
      s("ARKit", ["Face Tracking", "Plane Detection"]),
      s("XR Development", ["Interaction Toolkit"]),
      s("Rendering", ["Shaders", "Lighting"])
    ]
  },
  {
    id: "projects", title: "Advanced Projects", description: "Immersive experiences.", estimatedWeeks: 6,
    projects: [
      p("Virtual Campus Tour", "Interactive 3D navigation of a university.", ["Unity", "WebXR"]),
      p("AR Shopping Application", "Virtual furniture placement using plane detection.", ["Unity", "ARCore"]),
      p("VR Learning Platform", "Interactive virtual classroom with avatars.", ["Unity", "Oculus SDK", "Photon"]),
      p("Medical Simulation Environment", "Surgical training simulator in VR.", ["Unreal Engine", "C++"]),
      p("AR Interior Design Tool", "Real-time room measurement and decoration.", ["Swift", "ARKit"]),
      p("Virtual Collaboration Workspace", "Multiplayer VR meeting room.", ["Unity", "WebRTC"]),
      p("Industrial Training Simulator", "Hazardous environment training.", ["Unity", "SteamVR"]),
      p("Mixed Reality Productivity Suite", "Multiple virtual monitors in MR.", ["C#", "HoloLens"])
    ]
  }
]);

// IoT Engineer
createRoadmap("iot_engineer", "IoT Engineer", [
  {
    id: "foundations", title: "Foundations", description: "Hardware basics.", estimatedWeeks: 4,
    skills: [
      s("Electronics", ["Circuits", "Components"]),
      s("Sensors", ["Digital", "Analog"]),
      s("Microcontrollers", ["Architecture"]),
      s("Embedded C", ["Pointers", "Bitwise Operations"])
    ]
  },
  {
    id: "core", title: "Core Skills", description: "Connectivity.", estimatedWeeks: 8,
    skills: [
      s("ESP32", ["Wi-Fi", "Bluetooth"]),
      s("Arduino", ["Libraries", "Interfacing"]),
      s("MQTT", ["Pub/Sub", "Brokers"]),
      s("Cloud Integration", ["AWS IoT", "Azure IoT"])
    ]
  },
  {
    id: "projects", title: "Advanced Projects", description: "Connected devices.", estimatedWeeks: 6,
    projects: [
      p("Smart Home Automation System", "App controlled appliances and lighting.", ["ESP32", "MQTT", "React Native"]),
      p("Industrial Monitoring Network", "Factory floor machine telemetry.", ["Raspberry Pi", "Node-RED"]),
      p("Smart Agriculture Platform", "Soil moisture and automated irrigation.", ["Arduino", "Sensors", "AWS IoT"]),
      p("IoT Fleet Management", "GPS tracking for logistics vehicles.", ["Cellular IoT", "Google Maps API"]),
      p("Energy Consumption Tracker", "Real-time power usage analytics.", ["ESP8266", "InfluxDB", "Grafana"]),
      p("Environmental Monitoring Platform", "Air quality and temperature dashboard.", ["LoRaWAN", "ThingsBoard"]),
      p("Smart City Infrastructure System", "Connected streetlights and waste bins.", ["IoT Hub", "Azure"]),
      p("Healthcare Monitoring Device Network", "Wearable vitals tracking.", ["BLE", "MQTT", "Python"])
    ]
  }
]);

// Embedded Systems Engineer
createRoadmap("embedded_systems", "Embedded Systems Engineer", [
  {
    id: "foundations", title: "Foundations", description: "Low level programming.", estimatedWeeks: 4,
    skills: [
      s("C", ["Pointers", "Memory Management"]),
      s("Microcontrollers", ["ARM Cortex-M", "AVR"]),
      s("Electronics", ["PCB Basics", "Soldering"]),
      s("Digital Logic", ["Gates", "Flip-Flops", "Registers"])
    ]
  },
  {
    id: "core", title: "Core Skills", description: "Firmware development.", estimatedWeeks: 8,
    skills: [
      s("RTOS", ["Tasks", "Semaphores", "Mutexes"]),
      s("Device Drivers", ["I2C", "SPI", "UART"]),
      s("Communication Protocols", ["CAN", "LIN"]),
      s("Memory Management", ["Flash", "RAM", "EEPROM"])
    ]
  },
  {
    id: "projects", title: "Advanced Projects", description: "Hardware systems.", estimatedWeeks: 6,
    projects: [
      p("Automotive ECU Simulator", "Simulated engine control unit via CAN bus.", ["CAN bus", "Microcontroller", "C"]),
      p("RTOS Based Monitoring System", "Multi-threaded sensor logging.", ["FreeRTOS", "STM32"]),
      p("Smart Traffic Controller", "Adaptive intersection light timing.", ["Embedded C", "Sensors"]),
      p("Drone Flight Controller", "PID stabilization for quadcopters.", ["IMU", "PWM", "C++"]),
      p("Industrial Sensor Platform", "High frequency data logging to SD card.", ["SPI", "DMA", "FatFS"]),
      p("Wearable Health Monitoring Device", "Heart rate calculation algorithms.", ["I2C", "PPG Sensor"]),
      p("Embedded Security System", "Biometric access controller.", ["UART", "Fingerprint Module"]),
      p("Smart Robotics Controller", "Path planning for autonomous rovers.", ["Motor Drivers", "ROS"])
    ]
  }
]);

console.log("Successfully built missing roadmaps for QA, DB, SRE, AR/VR, IoT, and Embedded!");
