// Keep icons in /public (e.g., /docker-logo.svg)
export type Skill = {
  id: string;
  name: string;
  src: string;
  category?: string;   // "Build" | "Design" | "Data" | "Workflow"
  href?: string;
  weight?: number;

  // (for normalization)
  box?: number;
  scale?: number;
  xOffset?: number;
  yOffset?: number;
};

export const SKILLS: Skill[] = [
  { id: "docker",    name: "Docker",     src: "/skills/docker-logo.svg",       box: 70, scale: 1, category: "Workflow", weight: 10 },
  { id: "figma",     name: "Figma",      src: "/skills/figma-logo.svg",        box: 34, scale: 1, category: "Design",   weight: 20 },
  { id: "js",        name: "JavaScript", src: "/skills/js-logo.svg",           box: 50, scale: 1, category: "Build",    weight: 30 },
  { id: "python",    name: "Python",     src: "/skills/python-logo.svg",       box: 50, scale: 1, category: "Build",    weight: 40 },
  { id: "lottie",    name: "Lottie",     src: "/skills/lottie-logo.svg",       box: 50, scale: 1, category: "Design",   weight: 50 },
  { id: "git",       name: "Git",        src: "/skills/git-logo.svg",          box: 50, scale: 1, category: "Workflow", weight: 60 },
  { id: "kotlin",    name: "Kotlin",     src: "/skills/kotlin-logo.svg",       box: 50, scale: 1, category: "Build",   weight: 65 },
  { id: "adobe",     name: "Adobe",      src: "/skills/adobe-logo.svg",        box: 51, scale: 1, category: "Design",   weight: 70 },
  { id: "nextjs",    name: "Next.js",    src: "/skills/nextjs-logo.svg",       box: 50, scale: 1, category: "Build",    weight: 80 },
  { id: "flutter",   name: "Flutter",    src: "/skills/flutter_logo.svg",      box: 40, scale: 1, category: "Build",    weight: 90 },
  { id: "swift",     name: "Swift",      src: "/skills/swift-logo.svg",        box: 50, scale: 1, category: "Build",    weight: 95 },
  { id: "mongo",     name: "MongoDB",    src: "/skills/mongo-logo.svg",        box: 22, scale: 1, category: "Data",     weight: 100 },
  { id: "sql",       name: "SQL",        src: "/skills/sql-logo.svg",          box: 37, scale: 1, category: "Data",     weight: 110 },
  { id: "node",      name: "Node.js",    src: "/skills/node-logo.svg",         box: 44, scale: 1, category: "Build",    weight: 120 },
  { id: "css",       name: "CSS",        src: "/skills/css-logo.svg",          box: 50, scale: 1, category: "Build",    weight: 130 },
  { id: "vue",       name: "Vue",        src: "/skills/vue-logo.svg",          box: 58, scale: 1, category: "Build",    weight: 140 },
  { id: "graphql",   name: "GraphQL",    src: "/skills/graphql-logo.svg",      box: 44, scale: 1, category: "Data",     weight: 150 },
  { id: "bash",      name: "Bash",       src: "/skills/bash-logo.svg",         box: 50, scale: 1, category: "Workflow", weight: 160 },
  { id: "csharp",    name: "C#",         src: "/skills/c-sharp-logo.svg",      box: 44, scale: 1, category: "Build",    weight: 170 },
  { id: "clickup",   name: "ClickUp",    src: "/skills/clickup-logo.svg",      box: 42, scale: 1, category: "Workflow", weight: 180 },
  { id: "c",         name: "C",          src: "/skills/c-logo.svg",            box: 45, scale: 1, category: "Build",    weight: 190 },
  { id: "cpp",       name: "C++",        src: "/skills/c-plus-logo.svg",       box: 44, scale: 1, category: "Build",    weight: 200 },
  { id: "html",      name: "HTML",       src: "/skills/html-logo.svg",         box: 44, scale: 1, category: "Build",    weight: 210 },
  { id: "vstudio",   name: "VS",         src: "/skills/visualstudio-logo.svg", box: 50, scale: 1, category: "Workflow", weight: 220 },
  { id: "vscode",    name: "VSCode",     src: "/skills/vscode_logo.svg",       box: 34, scale: 1, category: "Workflow", weight: 230 },
  { id: "trello",    name: "Trello",     src: "/skills/trello-logo.svg",       box: 50, scale: 1, category: "Workflow", weight: 230 },
  { id: "android",   name: "Android",    src: "/skills/android-logo.svg",      box: 50, scale: 1, category: "Build",    weight: 240 },
  { id: "jetbrains", name: "JetBrains",  src: "/skills/jetbrains-logo.svg",    box: 50, scale: 1, category: "Workflow", weight: 250 },
  { id: "pytest",    name: "pytest",     src: "/skills/pytest-logo.svg",       box: 44, scale: 1, category: "Workflow", weight: 260 },
  { id: "cypress",   name: "Cypress",    src: "/skills/cypress-logo.svg",      box: 50, scale: 1, category: "Workflow", weight: 270 },
];
