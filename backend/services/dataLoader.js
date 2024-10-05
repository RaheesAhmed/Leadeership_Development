import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let capabilityAreas,
  responsibilityLevelsData,
  levelOneQuestions,
  levelTwoQuestions,
  cellDefinitions,
  demographicQuestions;

export async function loadData() {
  try {
    [
      capabilityAreas,
      responsibilityLevelsData,
      levelOneQuestions,
      levelTwoQuestions,
      cellDefinitions,
      demographicQuestions,
    ] = await Promise.all([
      readJSONFile("framework.json"),
      readResponsibilityLevelsData(),
      readLevelOneQuestions(),
      readLevelTwoQuestions(),
      readCellDefinitions(),
      readDemographicQuestions(),
    ]);

    console.log("Loaded level one questions:", levelOneQuestions.length);

    if (!responsibilityLevelsData || responsibilityLevelsData.length === 0) {
      throw new Error(
        "Responsibility levels data is empty or not loaded correctly"
      );
    }

    preprocessCapabilityAreas();
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
}

async function readJSONFile(filename) {
  const filePath = path.join(__dirname, "../data", filename);
  const rawData = await fs.readFile(filePath, "utf8");
  return JSON.parse(rawData);
}

export async function readResponsibilityLevelsData() {
  const data = await readJSONFile("responsibility_level.json");
  // console.log(
  //   "Read responsibility levels data:",
  //   JSON.stringify(data, null, 2)
  // );
  return data;
}

export async function readLevelOneQuestions() {
  const questions = await readJSONFile("ask_questions.json");
  console.log("Raw level one questions:", questions.length);
  const processedQuestions = questions.flatMap(processLevelOneQuestion);
  console.log("Processed level one questions:", processedQuestions.length);
  // console.log(
  //   "Sample processed question:",
  //   JSON.stringify(processedQuestions[0], null, 2)
  // );
  // console.log("Unique levels in questions:", [
  //   ...new Set(processedQuestions.map((q) => q.Lvl)),
  // ]);
  return processedQuestions;
}

function processLevelOneQuestion(question) {
  const capabilities = [
    "Building a Team",
    "Developing Others",
    "Leading a Team to Get Results",
    "Managing Performance",
    "Managing the Business",
    "Personal Development",
    "Communicating as a Leader",
    "Creating the Environment",
  ];

  const processedQuestions = [];

  capabilities.forEach((capability) => {
    const skillKey = Object.keys(question).find(
      (key) => key.includes(capability) && key.includes("(Skill)")
    );
    const confidenceKey = Object.keys(question).find(
      (key) => key.includes(capability) && key.includes("(Confidence)")
    );

    if (skillKey && confidenceKey) {
      processedQuestions.push({
        capability: capability,
        Lvl: question.Lvl,
        "Role Name": question[" Role Name"],
        question: question[skillKey],
        ratingQuestion: question[skillKey],
        reflection: question[confidenceKey],
      });
    }
  });

  return processedQuestions;
}

export async function readLevelTwoQuestions() {
  const questions = await readJSONFile("get_questions.json");
  console.log("Loaded level two questions:", questions.length);
  return questions;
}

export async function readCellDefinitions() {
  const cellDefinitions = await readJSONFile("framework_defination.json");
  return cellDefinitions.map(processCellDefinition);
}

//function to read demographic questions
export const readDemographicQuestions = async () => {
  try {
    return [
      {
        id: "name",
        question: "Please enter what name you'd like to use in your report.",
        type: "text",
        placeholder: "Short answer",
      },
      {
        id: "industry",
        question: "What industry is your business in?",
        type: "text",
        placeholder: "Healthcare, Technology, Manufacturing, or Education",
      },
      {
        id: "companySize",
        question: "How many people work at your company?",
        type: "number",
        placeholder: "500",
      },
      {
        id: "department",
        question:
          "What department or division do you primarily work in within your organization?",
        type: "text",
        placeholder: "Finance, Western Region Operations, or Company-wide",
      },
      {
        id: "jobTitle",
        question: "What is your job title?",
        type: "text",
        placeholder: "Enter your exact job title",
      },
      {
        id: "directReports",
        question: "How many people report directly to you?",
        type: "number",
        placeholder: "0",
      },
      {
        id: "directReportRoles",
        question:
          "What types of roles report directly to you? Please list them.",
        type: "text",
        placeholder: "Manager of Engineering, Sales Coordinator",
      },
      {
        id: "decisionLevel",
        question:
          "What level of decisions do you primarily make? (Please select the most appropriate option)",
        type: "select",
        options: [
          {
            value: "operational",
            label:
              "Operational (day-to-day decisions within your specific role, like processing invoices, responding to customer queries, or maintaining records)",
          },
          {
            value: "tactical",
            label:
              "Tactical (medium-term decisions affecting your team or department, such as improving workflow efficiency or determining project timelines)",
          },
          {
            value: "strategic",
            label:
              "Strategic (long-term decisions that shape major aspects of the organization, such as developing new company-wide programs, setting overarching business strategies, or leading major organizational changes)",
          },
        ],
      },
      {
        id: "typicalProject",
        question: "Describe a typical project or task you are responsible for.",
        type: "textarea",
        placeholder:
          "I develop IT security policies that align with company-wide risk management strategies and coordinate with the legal and tech departments to implement them.",
      },
      {
        id: "levelsToCEO",
        question:
          "How many levels are there between you and the highest-ranking executive in your organization?",
        type: "number",
        placeholder: "3",
      },
      {
        id: "managesBudget",
        question:
          "Does your role require you to manage a budget? If so, is it for your department or across multiple departments?",
        type: "boolean",
        additionalInfo: {
          type: "text",
          question:
            "If Yes, please specify whether it is for your department only or if it spans multiple departments.",
          placeholder:
            "Yes, I manage the budget for the entire marketing department",
        },
      },
    ];
  } catch (error) {
    console.error("Error reading demographic questions:", error.message);
    throw error;
  }
};

export const processQuestion = (question) => {
  const processedQuestion = {};

  for (const [key, value] of Object.entries(question)) {
    const trimmedKey = key.trim();
    if (
      trimmedKey === "Lvl" ||
      trimmedKey === "Role Name" ||
      trimmedKey === "Description"
    ) {
      processedQuestion[trimmedKey] =
        typeof value === "string" ? value.trim() : value;
    } else {
      const [category, type] = trimmedKey.split("(");
      const categoryKey = category.trim();
      const typeKey = type ? type.replace(")", "").trim() : "General";

      if (!processedQuestion[categoryKey]) {
        processedQuestion[categoryKey] = {};
      }

      if (typeof value === "string") {
        const [ratingQuestion, ...reflectionParts] = value.split("\n\n");

        processedQuestion[categoryKey][typeKey] = {
          ratingQuestion: ratingQuestion.trim(),
          reflection: reflectionParts.join("\n\n").trim(),
        };
      } else {
        processedQuestion[categoryKey][typeKey] = value;
      }
    }
  }

  return processedQuestion;
};

const processLevel = (level) => {
  const processedLevel = {};

  for (const [key, value] of Object.entries(level)) {
    const trimmedKey = key.trim();

    if (["Lvl", "Role Name", "Description"].includes(trimmedKey)) {
      processedLevel[trimmedKey] =
        typeof value === "string" ? value.trim() : value;
    } else {
      processedLevel[trimmedKey] = processThemesAndFocusAreas(value);
    }
  }

  return processedLevel;
};

const processCellDefinition = (cellDef) => {
  const processedCellDef = {};

  for (const [key, value] of Object.entries(cellDef)) {
    const trimmedKey = key.trim();

    if (trimmedKey === "Lvl") {
      processedCellDef[trimmedKey] = parseInt(value, 10);
    } else {
      processedCellDef[trimmedKey] =
        typeof value === "string" ? value.trim() : value;
    }
  }

  return processedCellDef;
};

const processThemesAndFocusAreas = (value) => {
  if (typeof value !== "string") return value;

  const lines = value.split("\n");
  const themes = [];
  let currentTheme = "";

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("Themes or Focus Areas:")) continue;
    if (trimmedLine === "") continue;

    if (trimmedLine.endsWith(":")) {
      if (currentTheme) themes.push(currentTheme);
      currentTheme = trimmedLine.slice(0, -1);
    } else {
      if (currentTheme) {
        currentTheme += " " + trimmedLine;
      } else {
        themes.push(trimmedLine);
      }
    }
  }

  if (currentTheme) themes.push(currentTheme);

  return themes;
};

export const capabilityAreasByLevel = {};

function preprocessCapabilityAreas() {
  if (!Array.isArray(capabilityAreas) || capabilityAreas.length === 0) {
    // console.warn("capabilityAreas is empty or not an array");
    return;
  }

  //console.log("Processing capability areas...");

  capabilityAreas.forEach((area) => {
    if (!area || typeof area !== "object") {
      //console.warn("Invalid area object:", area);
      return;
    }

    const level = area["Target Audience"];
    if (!level || typeof level !== "string") {
      //console.warn("Invalid Target Audience for area:", JSON.stringify(area));
      return;
    }

    const trimmedLevel = level.trim();
    if (trimmedLevel === "") {
      // console.warn("Empty Target Audience for area:", JSON.stringify(area));
      return;
    }

    if (!capabilityAreasByLevel[trimmedLevel]) {
      capabilityAreasByLevel[trimmedLevel] = [];
    }
    capabilityAreasByLevel[trimmedLevel].push(Object.keys(area)[0]);
  });

  //console.log(
  // "Processed capability areas:",
  // Object.keys(capabilityAreasByLevel)
  //);
}
