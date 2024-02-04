const Filter = require('bad-words');
const filter = new Filter({ placeHolder: '*' });

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
    "financialRecords": {
        "type": "Financial Records",
        "title": "Title of the Financial Record",
        "content": "Overview of the financial record's relevance to the financial aspects of the case.",
        "exactContent": "Detailed financial statements, transactions, and account summaries, with annotations explaining their significance.",
        "date": "Date of the record"
    },
    "surveillanceFootage": {
        "type": "Surveillance Footage",
        "title": "Location and Date of the Footage",
        "content": "Description of the footage's relevance to the case events.",
        "exactContent": "Timestamped summary of the footage, noting key moments and individuals captured, supplemented by still images or descriptions.",
        "date": "Date of the recording"
    },
    "medicalRecords": {
        "type": "Medical Records",
        "title": "Patient Name and Date of the Records",
        "content": "Significance of the medical records to the individual's condition or the case.",
        "exactContent": "Detailed account of medical visits, diagnoses, treatments, and physician notes, with relevance to case events highlighted.",
        "date": "Date of the records"
    },
    "policeReport": {
        "type": "Police Report",
        "title": "Report Number and Incident Date",
        "content": "Summary of the incident as reported to law enforcement.",
        "exactContent": "Complete report text, including descriptions of the incident, statements from involved parties and witnesses, and initial findings.",
        "date": "Date of the report"
    },
    "courtDocuments": {
        "type": "Court Document",
        "title": "Title of the Court Document",
        "content": "Brief on how the document pertains to the legal proceedings.",
        "exactContent": "Full document text, including legal arguments, motions, orders, or judgments, formatted according to legal document standards.",
        "date": "Date of the document"
    },
    "contractAgreements": {
        "type": "Contract Agreement",
        "title": "Title of the Contract",
        "content": "Relevance of the contract to the dispute or case.",
        "exactContent": "Complete contract text, including terms, conditions, parties involved, and signatures, with key clauses highlighted.",
        "date": "Date of the agreement"
    },
    "academicRecords": {
        "type": "Academic Records",
        "title": "Name of the Institution and Student",
        "content": "Overview of the academic records' relevance to the case.",
        "exactContent": "Transcripts, diplomas, and other records, detailing courses, grades, and achievements, with any discrepancies or notable achievements highlighted.",
        "date": "Date of the records"
    },
    // Add additional templates as required for your application
};

const createCasePrompt = (uid, caseInfo) => {
    const { lawSystem, additionalKeywords, fieldOfLaw, difficulty, position } = caseInfo;

    

    return `
    !Make sure it the whole response is JSON !!! No exceptions. 
    Create a legal case model in ${fieldOfLaw} as ${position}. The case should be ${difficulty} level, detailed with ${additionalKeywords ? filter.clean(additionalKeywords) : 'No additional Keywords,'} under ${lawSystem}. The more complex the difficulty, the more nuanced the case. Be specific with Names, Dates, and Documents. Keep it realistic. Format:

    {
        "title": "\${plaintiff fictional but realistic name} vs \${defendant fictional but realistic name}",
        "summary": "Concise case overview, including key allegations, defenses, and legal points in ${fieldOfLaw} under ${lawSystem}. This summary is for the viewer/reader",
        "participants": [
            {"name": \${name}, "role": \${role}, "alive": \${boolean}, "shortDescription": \${short description}}
        // YOU CAN ADD MORE PARTICIPANTS FOLLOWING THE GIVEN SCHEMA TO MAKE IT MORE INTERESTING
        ],
        "discoveries": [
            ${Object.values(discoveryTemplates).map(template => JSON.stringify(template, null, 2)).join(',\n')}
        ]
        "oppositionName": "Generate Fictional but realistic name for the Representing Attorney",

    }
    
    Ensure each element reflects the specified complexity and realism for the case's specifics and legal standards.    
    !Make sure it the whole response is JSON !!! No exceptions. Every little detail should be provided without blanks. Every information (cc numbers, everything)
    `;
}

const issueSubpoenaPrompt = (caseInfo, type, justification, entity) => {
    const inf = {caseInfo, type, justification, entity}
    const prompt = type.participant ? `
        Analyze a subpoena request for a participant within the provided case details. Your task is to judiciously decide on granting the subpoena based on its type, the justification provided, and its relevance to the case, while adhering to legal standards.

Subpoena Request for Participant:
- Type: 'Participant'
- Justification: '${justification}'
- Case Details: '${caseInfo}'

Determine if the subpoena request meets legal criteria. Check if the requested participant is already listed in '${caseInfo.participants}'. If they are not listed, provide details for a new fictitious participant. If they are listed, indicate their existing presence in the case.

Response Format:
{
  "granted": Boolean (based on the validity of the request),
  "rationale": "A detailed explanation for the decision to grant or deny the subpoena, considering the case's legal and factual context.",
  "participant": {
    "inList": Boolean (true if the participant is already in ${caseInfo.participants}, false otherwise),
    "details": inList ? null : {
      "name": "Fictitious Name",
      "role": "Role in the Case",
      "shortDescription": "Relevance of the participant to the case",
      "alive": Boolean
    }
  }
}

Deny the subpoena if it is incoherent, unjustified, duplicates existing information, or if granting it does not further the investigation. Your decision must reflect a comprehensive understanding of the legal and factual elements of the case. Ensure that the response is legally coherent and realistically aligns with the case scenario.

Remember, the AI response must accurately represent whether a subpoenaed participant is already included in the case details. If not, create a believable and relevant fictitious participant profile. The response should demonstrate careful consideration of the case's complexities and legal implications.
Response strictly in JSON!!
` : `
As the court, you are tasked with evaluating the appropriateness of issuing a subpoena based on detailed case information. Your decision-making process is guided by comprehensive criteria to ensure a realistic and coherent approach to the legal scenario.

**Case Information Provided:** ${caseInfo}

**Form Fields:**
- **Entity:** ${entity}
- **Justification:** ${justification}
- **Type:** ${type}

**Judgment Criteria:**
- **Relevance:** Assess the subpoena's relevance to the case's core issues. If there is incoherence between the type, entity, or justification, the subpoena should not be granted.
- **Coherence:** Ensure the request aligns with the case's facts and existing evidence. Incoherence between details like type, entity, and justification should lead to a denial of the subpoena.
- **Justification Quality:** The justification for the subpoena must be clear, sufficient, and well-structured.
- **Difficulty Level:** The case's complexity affects the scrutiny level for the subpoena request. Higher difficulty requires stricter evaluation.
- **Legality:** The subpoena must comply with current legal standards and regulations.
- **Duplication and Manipulation:** Deny the subpoena if it seeks information already available in the discovery phase or aims to manipulate the legal process.

**Response Format:**
Your decision and the subpoena document must be formatted in JSON to ensure application compatibility. The response structure is consistent, but the content varies based on your judgment. The response includes:

\`\`\`
{
  "granted": true or false,
  "rationale": "Your reasoning behind the decision",
  "document": {
    "type": "${type}, ${entity}",
    "title": "Title of the document, crafted to be realistic and relevant to the case",
    "content": "A brief summary of the document content",
    "exactContent": "A detailed and coherent representation of the document content, structured as a legitimate legal document, including pertinent dates and information. All blanks for dates, names, company names, and signatures should be filled with realistic, fabricated details specific to the case context.",
    "date": "Issuance date of the document"
  }
}
\`\`\`

**Creative Aspect:**
If the subpoena is granted, the document generated should reflect the case's complexity and difficulty. Incorporate elements that hint at underlying issues or broader themes, such as corruption or ethical dilemmas, to enrich the narrative.

**Detail and Specificity Requirement:**
It is crucial that the "exactContent" section of the document is complete and detailed, avoiding any blanks or placeholders. This includes specifying dates (e.g., "December 31, 2024"), full names, precise figures, and comprehensive descriptions that directly relate to the case. The document must realistically simulate a legal scenario, providing clear insights into the matter under consideration.

Ensure the response is in JSON, with the structure provided. Incoherence between details or any blanks in critical information will necessitate a revision of the response to meet these stringent requirements.`

    return prompt 
} 

module.exports = {createCasePrompt, issueSubpoenaPrompt}