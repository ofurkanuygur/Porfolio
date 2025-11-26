import { cvData, getAllSkills } from '../data/cv_data';

export const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
        return `Hello! I'm an AI assistant trained on ${cvData.personal.name}'s CV. Ask me about my experience, skills, projects, or contact info.`;
    }

    if (lowerInput.includes('who are you') || lowerInput.includes('about')) {
        return cvData.personal.about;
    }

    if (lowerInput.includes('experience') || lowerInput.includes('work') || lowerInput.includes('job')) {
        return cvData.experience.map(exp =>
            `**${exp.role} at ${exp.company}** (${exp.period})\n${exp.description.join('\n')}`
        ).join('\n\n');
    }

    if (lowerInput.includes('skill') || lowerInput.includes('stack') || lowerInput.includes('tech')) {
        return `My technical skills include: ${getAllSkills().join(', ')}.`;
    }

    if (lowerInput.includes('project')) {
        return cvData.projects.map(proj =>
            `**${proj.name}**\n${proj.description}\nTech: ${proj.tech.join(', ')}`
        ).join('\n\n');
    }

    if (lowerInput.includes('contact') || lowerInput.includes('email') || lowerInput.includes('reach')) {
        return `You can reach me at ${cvData.personal.email}.\nGitHub: ${cvData.personal.github}\nLinkedIn: ${cvData.personal.linkedin}`;
    }

    if (lowerInput.includes('education') || lowerInput.includes('school') || lowerInput.includes('degree')) {
        return cvData.education.map(edu =>
            `**${edu.degree}**\n${edu.school} (${edu.year})`
        ).join('\n\n');
    }

    if (lowerInput.includes('clear') || lowerInput.includes('cls')) {
        return 'CLEAR_COMMAND';
    }

    return "I'm not sure about that. Try asking about 'experience', 'skills', 'projects', or 'contact'.";
};
