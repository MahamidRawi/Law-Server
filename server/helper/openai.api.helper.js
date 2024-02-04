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
- Type: 'Participant', ${entity}
- Justification: '${justification}'
- Case Details: '${caseInfo}'

Determine if the subpoena request meets legal criteria. Check if the requested participant is already listed in '${caseInfo.participants}'. If they are not listed, provide details for a new fictitious participant. If they are listed, indicate their existing presence in the case.
You have to option to deny the subpoena, if the justification is not good enough or it is irrelevant, or it is not well justified. And also if there is incoherence between the Type and Justification, and Entity
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
` : `Given the details of a legal case and a request for a subpoena concerning specific documents, your task is to evaluate the request and generate the document content dynamically, based on the provided details.

Case Information: ${JSON.stringify(caseInfo)}

Request Details:
- Entity: ${entity}
- Document Type: ${type}
- Justification: "${justification}"

Criteria for Decision:
1. Evaluate the relevance of the requested document to the case.
2. Assess coherence among the case information, the entity involved, and the document type requested.
3. Examine the strength and structure of the justification provided.
4. Ensure compliance with legal standards and avoid duplicates or leading requests.

The response must be in JSON format, exactly as it follows:
{
  "granted": true/false,
  "rationale": "Provide a comprehensive rationale for granting or denying the subpoena, integrating the case details, request specifics, and applicable legal standards. Your reasoning should be detailed, reflecting a nuanced understanding of the case and the significance of the requested document.",
  "document": {
    "type": "${type}",
    "title": "Construct a specific and relevant title for the document related to ${entity}, ensuring it is directly relevant to the case at hand.",
    "content": "Provide a concise summary of the document’s content, highlighting its relevance and importance to the case and the subpoena request.",
    "exactContent": "Generate detailed, structured, and realistic content for the document, including precise dates, names, incidents, and other factual information, specifically tailored to the case and document type. Avoid placeholders and generic descriptions, creating a narrative that includes a sequence of detailed entries or points relevant to the case, demonstrating a deep understanding of the case dynamics. Everything must be structured in a string. Strictly.",
    "date": "Specify the fictional issuance date of the document, ensuring it aligns accurately with the case timeline."
  }
}

Instructional Guidance:
- The decision on the subpoena must be logically derived from the provided case details and the justification argument.
- The rationale section should articulate a clear, reasoned argument, referencing specific elements from the case information and legal criteria that influence the decision.
- The document section must include precision and depth. The "exactContent" should be presented not in paragraphs, but in an excellently structured format, offering a granular depiction of the document’s contents as they would exist in reality. This includes creating a sequence of detailed events, specific interactions, and direct references to facts relevant to the case.

Ensure the model’s response embodies a comprehensive grasp of legal document preparation, accurately reflecting the unique aspects of the case and document type, adhering strictly to the given JSON format.
`
    return prompt 
} 

module.exports = {createCasePrompt, issueSubpoenaPrompt}