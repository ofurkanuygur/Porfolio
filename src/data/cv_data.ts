export interface CVData {
    personal: {
        name: string;
        role: string;
        about: string;
        email: string;
        phone: string;
        github: string;
        linkedin: string;
        location: string;
        githubStats?: {
            followers: number;
            following: number;
            achievements: string[];
        };
        funFacts: string[];
    };
    skills: {
        programming: string[];
        frontend: string[];
        backend: string[];
        ai: string[];
        database: string[];
        devops: string[];
        security: string[];
    };
    experience: {
        company: string;
        role: string;
        period: string;
        location: string;
        description: string[];
    }[];
    projects: {
        name: string;
        description: string;
        tech: string[];
        github?: string;
        live?: string;
    }[];
    education: {
        school: string;
        degree: string;
        year: string;
        location: string;
        thesis?: string;
    }[];
    certifications: {
        name: string;
        issuer: string;
        year: string;
    }[];
    languages: {
        language: string;
        level: string;
    }[];
}

export const cvData: CVData = {
    personal: {
        name: "Oktay Furkan Uygur",
        role: "Full Stack Software Engineer | AI Systems Developer",
        about: "Full Stack Software Engineer with 4+ years developing scalable web applications and AI-integrated systems. Expert in JavaScript, TypeScript, Python, React, Node.js, and Model Context Protocol (MCP) implementation. Proven track record building high-performance B2B solutions processing 100,000+ daily transactions. Specialized in multi-agent AI systems. Strong foundation in SOLID principles, Clean Code practices, Test-Driven Development (TDD), and Agile methodologies.",
        email: "ofurkanuygur@gmail.com",
        phone: "+90-554-461-7576",
        github: "https://github.com/ofurkanuygur",
        linkedin: "https://linkedin.com/in/oktay-furkan-uygur",
        location: "Istanbul, Turkey",
        githubStats: {
            followers: 28,
            following: 58,
            achievements: ["Pull Shark ×3", "Quickdraw", "YOLO"]
        },
        funFacts: [
            "Şu an yeni fırsatlara açık! 🚀",
            "Kahve bağımlısı - günde ortalama 4 fincan",
            "README dosyalarına kişilik katmayı seviyor",
            "Backend-focused ama frontend'den de kaçmıyor",
            "Algoritma yarışmalarına katılıyor (Polygorithm Club)",
            "AI ile sohbet etmeyi seviyor (bu chatbot gibi)",
            "Istanbul'da yaşıyor ama kod evrensel",
            "Pro GitHub kullanıcısı",
            "Technical debt ile dalga geçmeyi seviyor"
        ],
    },
    skills: {
        programming: ["JavaScript", "TypeScript", "Python", "C++", "C", "SQL", "HTML5", "CSS3"],
        frontend: ["React.js", "Angular", "Redux", "Next.js", "Webpack", "Babel", "Sass", "Tailwind CSS", "Material-UI", "Bootstrap"],
        backend: ["Node.js", "Express.js", "Django", "Flask", "FastAPI", "REST API", "WebSockets"],
        ai: ["Model Context Protocol (MCP)", "Multi-Agent Systems", "Autonomous Agents", "LangChain", "OpenAI API", "Claude API", "Vector Databases"],
        database: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Elasticsearch", "DynamoDB"],
        devops: ["AWS (EC2, S3, Lambda)", "Azure", "Google Cloud Platform (GCP)", "Docker", "Jenkins", "GitHub Actions", "CI/CD", "Terraform"],
        security: ["AES-256", "HMAC-SHA256", "OAuth 2.0", "JWT", "SSL/TLS"],
    },
    experience: [
        {
            company: "DIJI.TECH",
            role: "Full Stack Developer",
            period: "April 2025 - October 2025",
            location: "Istanbul, Turkey",
            description: [
                "Architected and developed 5+ production-ready full-stack applications using React, Django, and PostgreSQL, serving 10,000+ daily active users with 99.9% uptime",
                "Implemented Model Context Protocol (MCP) architecture reducing system coupling by 45% and improving code reusability by 60% across microservices",
                "Designed multi-agent AI system handling 1,000+ concurrent tasks with autonomous decision-making, reducing manual intervention by 75%",
                "Integrated AI-driven development tools (Claude API) accelerating development cycles by 40% and reducing bug density by 30%",
                "Mentored 2 junior developers on Clean Code practices and SOLID principles, improving team code quality metrics by 25%"
            ]
        },
        {
            company: "Trair Software Technology Investments",
            role: "Software Developer",
            period: "June 2023 - September 2024",
            location: "Istanbul, Turkey",
            description: [
                "Developed B2B e-commerce platform processing $2M+ monthly transactions using React, Django, and PostgreSQL with 99.95% availability",
                "Optimized database queries reducing page load time from 3.2s to 0.8s, improving conversion rate by 18%",
                "Implemented comprehensive testing suite with 85% code coverage using Jest and Pytest, reducing production bugs by 40%",
                "Collaborated with 15+ cross-functional team members using Agile/Scrum methodology, delivering 20+ features on schedule",
                "Integrated payment gateways (Stripe) and third-party APIs handling 50,000+ daily transactions with zero security incidents"
            ]
        },
        {
            company: "Masraff",
            role: "Junior Software Engineer",
            period: "September 2021 - June 2023",
            location: "Istanbul, Turkey",
            description: [
                "Participated in discussions on software functionality, consistency, and practicality to drive high-quality outcomes",
                "Collaborated with cross-functional teams to troubleshoot and resolve technical issues in a timely manner",
                "Designed and maintained databases to optimize data storage and retrieval processes",
                "Engaged in user requirement meetings to accurately translate client needs into proposed application designs"
            ]
        }
    ],
    projects: [
        {
            name: "AI Portfolio Website",
            description: "A macOS-style interactive portfolio with integrated AI chatbot powered by Gemini API. Features window management, dark/light mode, system sounds, and Spotlight search.",
            tech: ["React", "TypeScript", "TailwindCSS", "Framer Motion", "Gemini API"],
            live: "https://ofurkanuygur.github.io"
        },
        {
            name: "Search Case",
            description: "Search functionality implementation case study in C#.",
            tech: ["C#", ".NET", "Search Algorithms"],
            github: "https://github.com/ofurkanuygur/search-case"
        },
        {
            name: "AI Image Detection API",
            description: "Python-based API for AI-powered image detection and classification.",
            tech: ["Python", "FastAPI", "Machine Learning", "Computer Vision"],
            github: "https://github.com/ofurkanuygur/ai-image-detect-api"
        },
        {
            name: "MCP for Beginners",
            description: "Open-source curriculum introducing Model Context Protocol (MCP) fundamentals through real-world, cross-language examples.",
            tech: ["MCP", "AI", "Multi-Agent Systems", "Documentation"],
            github: "https://github.com/ofurkanuygur/mcp-for-beginners"
        },
        {
            name: "Polygorithm Club",
            description: "Algorithms and Data Structures implementations in C#, Scala, and C++.",
            tech: ["Scala", "C++", "C#", "Algorithms", "Data Structures"],
            github: "https://github.com/ofurkanuygur/polygorithm-club"
        },
        {
            name: "Food Classification",
            description: "Machine learning model for classifying food images using deep learning.",
            tech: ["Python", "TensorFlow", "Deep Learning", "Image Classification"],
            github: "https://github.com/ofurkanuygur/food_classification"
        },
        {
            name: "UAV Rental Project",
            description: "Web application for UAV (drone) rental management system.",
            tech: ["HTML", "CSS", "JavaScript"],
            github: "https://github.com/ofurkanuygur/UAV-Rental-Project"
        },
        {
            name: "Authentication App",
            description: "Full-featured authentication application with modern security practices.",
            tech: ["TypeScript", "Node.js", "Authentication", "JWT"],
            github: "https://github.com/ofurkanuygur/authentication-app"
        }
    ],
    education: [
        {
            school: "Balikesir University",
            degree: "Bachelor of Science in Electrical and Electronics Engineering",
            year: "2020 - 2024",
            location: "Balikesir, Turkey",
            thesis: "Developed secure real-time CAN Bus communication system between dual STM32 microcontrollers using AES-256 encryption and HMAC-SHA256 authentication for automotive safety applications"
        }
    ],
    certifications: [
        {
            name: "Claude Code in Action Certification",
            issuer: "Anthropic",
            year: "2025"
        },
        {
            name: "AWS Certified AI Practitioner - Associate",
            issuer: "Amazon Web Services",
            year: "Planned 2026"
        }
    ],
    languages: [
        {
            language: "Turkish",
            level: "Native Speaker"
        },
        {
            language: "English",
            level: "Professional Working Proficiency (B1)"
        },
        {
            language: "German",
            level: "Elementary Proficiency (A2)"
        }
    ]
};

// Helper function to get all skills as a flat array
export const getAllSkills = (): string[] => [
    ...cvData.skills.programming,
    ...cvData.skills.frontend,
    ...cvData.skills.backend,
    ...cvData.skills.ai,
    ...cvData.skills.database,
    ...cvData.skills.devops,
    ...cvData.skills.security,
];
