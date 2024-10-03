import { readLevelOneQuestions, readLevelTwoQuestions} from "./dataLoader.js";

export async function getLevelOneQuestions() {
    const levelOneQuestions = await readLevelOneQuestions();
    //console.log(levelOneQuestions);
    return levelOneQuestions;
}

export async function getLevelTwoQuestions() {
    const levelTwoQuestions = await readLevelTwoQuestions();
    return levelTwoQuestions;
}

export async function getLevelOneQuestionsbyLevel({ level }) {
    const levelOneQuestions = await readLevelOneQuestions();
    console.log("Fetching capability questions for level:", level);
    console.log("Total level one questions:", levelOneQuestions?.length || 0);
  
    // Normalize the level string and convert to number
    const normalizedLevel = parseInt(level);
  
    if (isNaN(normalizedLevel)) {
      console.warn("Invalid level provided:", level);
      return [];
    }
  
    console.log("Normalized level:", normalizedLevel);
  
    // Filter questions for the specified level
    const filteredQuestions = levelOneQuestions.filter(
      (q) => q.Lvl === normalizedLevel
    );
  
    // Group questions by capability area
    const questionsByArea = filteredQuestions.reduce((acc, question) => {
      if (!acc[question.capability]) {
        acc[question.capability] = [];
      }
      acc[question.capability].push({
        question: question.question,
        ratingQuestion: question.ratingQuestion,
        reflection: question.reflection,
      });
      return acc;
    }, {});
  
    // Convert the grouped questions into the desired format
    const LevelOneQuestionsbyLevel = Object.entries(questionsByArea).map(
      ([area, questions]) => ({
        area,
        questions,
      })
    );
  
    
  
    return LevelOneQuestionsbyLevel;
  }

  export async function getLevelTwoQuestionsbyLevel({ level }) {
    const levelTwoQuestions = await getLevelTwoQuestions();
    console.log("Fetching level two questions for level:", level);
    console.log("Total level two questions:", levelTwoQuestions?.length || 0);
  
    // Normalize the level string and convert to number
    const normalizedLevel = parseInt(level);
  
    if (isNaN(normalizedLevel)) {
      console.warn("Invalid level provided:", level);
      return [];
    }
  
    console.log("Normalized level:", normalizedLevel);
  
    // Filter questions for the specified level
    const filteredQuestions = levelTwoQuestions.filter(
      (q) => q.Lvl === normalizedLevel
    );
  
    console.log("Total level two questions found:", filteredQuestions.length);
    console.log("Filtered questions:", filteredQuestions);
    return filteredQuestions;
  }