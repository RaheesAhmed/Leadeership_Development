export const learningResources = {
  leadership: {
    books: [
      {
        title: "Good to Great",
        author: "Jim Collins",
        type: "Book",
        link: "https://www.amazon.com/Good-Great-Some-Companies-Others/dp/0066620996",
        description: "Research-based insights on what makes companies excel",
      },
      {
        title: "Start with Why",
        author: "Simon Sinek",
        type: "Book",
        link: "https://www.amazon.com/Start-Why-Leaders-Inspire-Everyone/dp/1591846447",
        description: "Understanding leadership through purpose and inspiration",
      },
    ],
    courses: [
      {
        title: "Leading with Emotional Intelligence",
        platform: "Coursera",
        type: "Course",
        link: "https://www.coursera.org/learn/emotional-intelligence-in-leadership",
        description: "Develop emotional intelligence for better leadership",
      },
      {
        title: "Strategic Leadership and Management Specialization",
        platform: "Coursera",
        type: "Course",
        link: "https://www.coursera.org/specializations/strategic-leadership",
        description: "Comprehensive leadership development program",
      },
    ],
    articles: [
      {
        title: "What Makes a Leader?",
        author: "Daniel Goleman",
        type: "Article",
        link: "https://hbr.org/2004/01/what-makes-a-leader",
        description: "Harvard Business Review article on leadership essentials",
      },
    ],
  },
  teamManagement: {
    books: [
      {
        title: "The Five Dysfunctions of a Team",
        author: "Patrick Lencioni",
        type: "Book",
        link: "https://www.amazon.com/Five-Dysfunctions-Team-Leadership-Fable/dp/0787960756",
        description: "Understanding and overcoming team challenges",
      },
    ],
    courses: [
      {
        title: "Managing Teams Effectively",
        platform: "LinkedIn Learning",
        type: "Course",
        link: "https://www.linkedin.com/learning/managing-teams",
        description: "Practical team management strategies",
      },
    ],
  },
  communication: {
    books: [
      {
        title: "Crucial Conversations",
        author: "Kerry Patterson",
        type: "Book",
        link: "https://www.amazon.com/Crucial-Conversations-Talking-Stakes-Second/dp/1469266822",
        description: "Tools for handling high-stakes conversations",
      },
    ],
    courses: [
      {
        title: "Business Communication Skills",
        platform: "edX",
        type: "Course",
        link: "https://www.edx.org/learn/business-communication",
        description: "Improve business communication effectiveness",
      },
    ],
  },
  performanceManagement: {
    books: [
      {
        title: "First, Break All the Rules",
        author: "Marcus Buckingham",
        type: "Book",
        link: "https://www.amazon.com/First-Break-All-Rules-Differently/dp/1595621113",
        description: "What great managers do differently",
      },
    ],
    courses: [
      {
        title: "Performance Management: A Strategic Perspective",
        platform: "Coursera",
        type: "Course",
        link: "https://www.coursera.org/learn/performance-management",
        description: "Strategic approach to performance management",
      },
    ],
  },
};

export function getResourcesByCapability(capability, count = 3) {
  const allCategories =
    learningResources[capability.toLowerCase()] || learningResources.leadership;
  const resources = [];

  // Collect resources from each category
  for (const category of Object.values(allCategories)) {
    resources.push(...category);
  }

  // Shuffle and return requested number of resources
  return resources
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((resource) => ({
      title: resource.title,
      type: resource.type,
      link: resource.link,
    }));
}
