const Filter = require('bad-words');
const filter = new Filter({placeHolder: '*'});

const createCasePrompt = (uid, caseInfo) => {
    const {lawSystem, additionalKeywords, fieldOfLaw, difficulty, position} = caseInfo;
    return `Create a legal case model in ${fieldOfLaw} as ${position}. The case should be ${difficulty} level, detailed with ${additionalKeywords ? filter.clean(additionalKeywords) : 'No additional Keywords,'} under ${lawSystem}. The more complex the difficulty, the more nuanced the case. Be specific with Names (and those of experts), and Dates Keep it realistic. Format:

    {
      "title": "\${plaintiff} vs \${defendant}",
      "summary": "Concise case overview, including key allegations, defenses, and legal points in ${fieldOfLaw} under ${lawSystem}. This summary is for the viewer/reader",
      "participants": [
        {"name": \${name}, "role": \${role}, "alive": \${boolean}}
      ],
      "discoveries": [
        {
          "type": "Type (e.g., Testimony, Document)",
          "title": "Discovery title",
          "content": "Detailed description or dialog repliques.",
          "dialog": "true/false for dialogues",
          "exactContent": "The Exact content of the document, not summary, exact content litteraly word by word with exact form : {if mail : {sender (name), receiver (name), content, date, parties (object of name and role)} and in the content I want exact information as if we were in the situation}"
          "date": "Discovery date",
          "repliques": "Array of {speaker, statement} if dialog is true"
        }
      ]
    }
    
    Ensure each element reflects the specified complexity and realism for the case's specifics and legal standards.    
    ATTENTION : STRICTLY JSON
    `
}

module.exports = {createCasePrompt}