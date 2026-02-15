/* ================================================================
   AI Resume Builder — Build Track Step Definitions
   Project 3 inside KodNest Premium Build System
   ================================================================ */

const RB_STEPS = [
    {
        id: 1,
        slug: '01-problem',
        route: '/rb/01-problem',
        title: 'Problem Statement',
        subtitle: 'Define the core problem your AI Resume Builder solves.',
        description:
            'Identify why current resume-building tools fall short. Who is the user? What pain points exist? Why does an AI-powered approach matter?',
        promptLabel: 'Copy This Into Lovable',
        defaultPrompt: `Create a Problem Statement document for an AI Resume Builder application.\n\nInclude:\n- Target user persona\n- 3 core pain points with current resume tools\n- Why AI-powered resume building is the solution\n- Success metrics (how will we measure impact?)\n\nFormat as a clean, professional document with sections.`,
    },
    {
        id: 2,
        slug: '02-market',
        route: '/rb/02-market',
        title: 'Market Research',
        subtitle: 'Analyze the competitive landscape and market opportunity.',
        description:
            'Research existing resume builders (Zety, Novoresume, Resume.io, etc). Identify gaps. Define your unique value proposition.',
        promptLabel: 'Copy This Into Lovable',
        defaultPrompt: `Create a Market Research document for an AI Resume Builder.\n\nInclude:\n- Competitive analysis of top 5 resume builders\n- Feature comparison matrix\n- Market gaps and opportunities\n- Unique value proposition for our AI-powered approach\n- Target market size estimation\n\nFormat as a structured research document.`,
    },
    {
        id: 3,
        slug: '03-architecture',
        route: '/rb/03-architecture',
        title: 'System Architecture',
        subtitle: 'Design the overall system architecture and tech stack.',
        description:
            'Define the frontend framework, backend services, AI integration points, data storage, and deployment strategy.',
        promptLabel: 'Copy This Into Lovable',
        defaultPrompt: `Create a System Architecture document for an AI Resume Builder.\n\nInclude:\n- Tech stack selection with rationale\n- System component diagram (describe in text)\n- Data flow from user input → AI processing → resume output\n- API integration points (OpenAI/Claude for content generation)\n- Storage strategy for templates and user data\n\nFormat as a technical architecture document.`,
    },
    {
        id: 4,
        slug: '04-hld',
        route: '/rb/04-hld',
        title: 'High-Level Design',
        subtitle: 'Define modules, services, and their interactions.',
        description:
            'Break the system into major modules: Template Engine, AI Content Generator, PDF Export, User Management, and define how they communicate.',
        promptLabel: 'Copy This Into Lovable',
        defaultPrompt: `Create a High-Level Design (HLD) document for an AI Resume Builder.\n\nModules to define:\n1. Template Engine — manages resume layouts\n2. AI Content Generator — rewrites/enhances content\n3. PDF/DOCX Export — generates downloadable files\n4. User Profile Manager — stores user data\n5. Analytics Dashboard — tracks resume performance\n\nFor each module include: purpose, inputs, outputs, dependencies.\nInclude a module interaction diagram (text-based).`,
    },
    {
        id: 5,
        slug: '05-lld',
        route: '/rb/05-lld',
        title: 'Low-Level Design',
        subtitle: 'Define component APIs, data models, and algorithms.',
        description:
            'Specify React components, state management, API endpoints, database schemas, and the AI prompt engineering strategy.',
        promptLabel: 'Copy This Into Lovable',
        defaultPrompt: `Create a Low-Level Design (LLD) document for an AI Resume Builder.\n\nInclude:\n- React component tree with props/state\n- API endpoint specifications (REST)\n- Database schema (users, resumes, templates)\n- AI prompt templates for content enhancement\n- State management approach (Context/Redux)\n- Error handling strategy\n\nFormat as a detailed technical specification.`,
    },
    {
        id: 6,
        slug: '06-build',
        route: '/rb/06-build',
        title: 'Build',
        subtitle: 'Implement the core application following your designs.',
        description:
            'Build the working application in Lovable. Follow your architecture. Implement the template engine, AI integration, and export functionality.',
        promptLabel: 'Copy This Into Lovable',
        defaultPrompt: `Build an AI Resume Builder application.\n\nCore features to implement:\n1. Resume editor with live preview\n2. Multiple professional templates\n3. AI-powered content suggestions (simulate with pre-built prompts)\n4. Section management (Experience, Education, Skills, Projects)\n5. PDF export capability\n6. Responsive design\n\nUse React + TypeScript. Focus on clean UI and smooth UX.\nDo NOT implement backend — use localStorage for data persistence.`,
    },
    {
        id: 7,
        slug: '07-test',
        route: '/rb/07-test',
        title: 'Test',
        subtitle: 'Verify every feature works as designed.',
        description:
            'Run through the complete test checklist. Verify template rendering, AI suggestions, export quality, responsive design, and data persistence.',
        promptLabel: 'Copy This Into Lovable',
        defaultPrompt: `Create a Test Plan for the AI Resume Builder.\n\nTest categories:\n1. Template rendering tests\n2. AI content generation tests\n3. PDF export quality tests\n4. Data persistence tests (localStorage)\n5. Responsive design tests\n6. Accessibility tests\n7. Cross-browser compatibility tests\n\nFor each test: describe steps, expected result, pass/fail criteria.`,
    },
    {
        id: 8,
        slug: '08-ship',
        route: '/rb/08-ship',
        title: 'Ship',
        subtitle: 'Deploy the application and collect final artifacts.',
        description:
            'Deploy to production. Verify the live URL works. Push code to GitHub. Collect all three artifact links for final submission.',
        promptLabel: 'Copy This Into Lovable',
        defaultPrompt: `Create a Ship Checklist for the AI Resume Builder.\n\nDeployment steps:\n1. Final build verification\n2. Deploy to Vercel/Netlify\n3. Verify production URL\n4. Push to GitHub repository\n5. Update README with project description\n6. Add live demo link to README\n7. Final cross-browser check on production\n\nFormat as a deployment runbook with checkboxes.`,
    },
]

export default RB_STEPS
