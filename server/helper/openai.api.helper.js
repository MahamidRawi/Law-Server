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
{
    "prompt": "Remember, strictly JSON response (if not JSON response, It is the end of the world). Based on the provided subpoena request details, generate a JSON response. If the request is for a 'Family Tree', automatically grant it and include a detailed fictional family tree in the response. For other document types specified by 'type', generate a fictional document relevant to that type with specific dates, names, and information that adhere to legal standards without duplicating case discoveries. Use real case details and ensure the response is in strict JSON format, focusing on creating plausible content for the 'exactContent' field.\n\nSubpoena Request Details:\n- Type: 'Type of the requested document'\n- Justification: 'Justification for the subpoena request'\n- Entity: 'The entity involved in the subpoena request'\n- CaseInfo: 'Detailed information about the case including parties involved and complexity level'\n\nRequired JSON response format for any document request, including 'Family Tree':\n{\n  \"granted\": true,\n  \"rationale\": \"Reasoning behind the decision based on the subpoena type\",\n  \"document\": {\n    \"type\": \"The document type requested\",\n    \"title\": \"A fictitious title relevant to the case\",\n    \"content\": \"A summary explaining the document's relevance\",\n    \"exactContent\": \"A detailed, fictional representation of the document with dates, names, and specifics\",\n    \"date\": \"The fictional creation date of the document\"\n  }\n}\n\nThe document generated must be realistic and detailed, adhering to confidentiality and legal compliance. If 'Family Tree' is not requested, generate the document according to the specified 'type', ensuring the content is structured like a legal document and the 'exactContent' is a string that vividly provides fictional information that may or not help the user advance in the case",
    "type": ${type},
    "justification": ${justification},
    "entity": ${entity},
    "caseInfo": ${caseInfo}

    for example, if I ask for family tree, create something similar to this : 
    {
        "type": "Family Tree",
        "title": "The Johnson Family Tree",
        "content": "This family tree outlines the defendant's ancestral lineage and immediate family, highlighting connections relevant to the case.",
        "exactContent": "Family Tree Report\n\nTitle: The Johnson Family Tree\n\nDate: 2024-01-28\n\nThis family tree report provides a detailed overview of the ancestral lineage and immediate family of the defendant, Michael Johnson, in relation to the case of Smith vs Johnson under Civil Law in France.\n\nAncestral Lineage:\n\n- Parents: William Johnson (b. 1955, d. 2010), Rachel Johnson (b. 1958)\n\n- Grandparents: Charles Johnson (b. 1930, d. 2005), Elizabeth Johnson (b. 1932, d. 2012); James Adams (b. 1935, d. 2015), Margaret Adams (b. 1938)\n\nImmediate Family:\n\n- Spouse: Sarah Johnson (b. 1978)\n\n- Children: David Johnson (b. 2000), Emma Johnson (b. 2005)\n\nConnections Relevant to the Case:\n\n- William Johnson: Known for financial investments and offshore accounts, including transactions with entities related to the plaintiff, John Smith.\n\n- Rachel Johnson: Inherited significant assets from her father, Charles Johnson, and has been involved in trusts and financial arrangements potentially linked to the defendant's alleged money laundering activities. \n\n- Sarah Johnson: Has been a beneficiary of offshore accounts connected to the defendant, raising questions about the source of funds and asset tracing in the case.\n",
        "date": "2024-01-28"
      },
  }
  
`
    return prompt 
} 

module.exports = {createCasePrompt, issueSubpoenaPrompt}