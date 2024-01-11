const Filter = require('bad-words');
const filter = new Filter({ placeHolder: '*' });

const createCasePrompt = (uid, caseInfo) => {
    const { lawSystem, additionalKeywords, fieldOfLaw, difficulty, position } = caseInfo;

    const discoveryTemplates = {
        "document": {
            "type": "Document",
            "title": "Title of the Document",
            "content": "Brief description of the document's relevance to the case.",
            "exactContent": "Detailed and formatted content of the document, including specific data, names, and relevant information.",
            "date": "Date of the document"
        },
        "testimony": {
            "type": "Testimony",
            "title": "Title of the Testimony",
            "content": "Summary of the testimony and its significance.",
            "exactContent": "Full transcript of the testimony, including questions and answers, formatted as a legal document.",
            "date": "Date of the testimony"
        },
        "investigationReport": {
            "type": "Investigation Report",
            "title": "Title of the Investigation Report",
            "content": "Overview of the investigation's findings.",
            "exactContent": "Detailed report including methodology, findings, and conclusions.",
            "date": "Date of the report"
        },
        "email": {
            "type": "Email",
            "title": "Subject of the Email",
            "content": "Summary of the email's relevance to the case.",
            "exactContent": "Complete email conversation, including sender, receiver, date, and body of the email.",
            "date": "Date of the email"
        },
        // Add more templates as needed
    };

    return `Create a legal case model in ${fieldOfLaw} as ${position}. The case should be ${difficulty} level, detailed with ${additionalKeywords ? filter.clean(additionalKeywords) : 'No additional Keywords,'} under ${lawSystem}. The more complex the difficulty, the more nuanced the case. Be specific with Names, Dates, and Documents. Keep it realistic. Format:

    {
        "title": "\${plaintiff} vs \${defendant}",
        "summary": "Concise case overview, including key allegations, defenses, and legal points in ${fieldOfLaw} under ${lawSystem}. This summary is for the viewer/reader",
        "participants": [
            {"name": \${name}, "role": \${role}, "alive": \${boolean}}
        ],
        "discoveries": [
            ${Object.values(discoveryTemplates).map(template => JSON.stringify(template, null, 2)).join(',\n')}
        ]
    }
    
    Ensure each element reflects the specified complexity and realism for the case's specifics and legal standards.    
    ATTENTION: STRICTLY JSON! IMPORTANT
    `;
}

module.exports = {createCasePrompt}