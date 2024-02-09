const Filter = require('bad-words');
const filter = new Filter({ placeHolder: '*' });

const discoveryTemplates = {
    "document": {
        "type": "Document",
        "title": "Title of the Document",
        "content": "Brief description of the document's relevance to the case.",
        "exactContent": "[I don't want summaries, nor paragprah, nor overviews. I want hight details level, very good structure. Detailed and formatted content of the document, including specific data, names, and relevant information.]",
        "date": "Date of the document"
    },
    "testimony": {
        "type": "Testimony",
        "title": "Title of the Testimony",
        "content": "Summary of the testimony and its significance.",
        "exactContent": "[I don't want summaries, nor paragprah, nor overviews. I want hight details level, very good structure.Full transcript of the testimony, including questions and answers, formatted as a legal document. If it is a dialogue, I want Q/A, otherwise, I want exactly what was said]",
        "date": "Date of the testimony"
    },
    "investigationReport": {
        "type": "Investigation Report",
        "title": "Title of the Investigation Report",
        "content": "Overview of the investigation's findings.",
        "exactContent": "[I don't want summaries, nor paragprah, nor overviews. I want hight details level, very good structure.Detailed report including methodology, findings, and conclusions.]",
        "date": "Date of the report"
    },
    "email": {
        "type": "Email",
        "title": "Subject of the Email",
        "content": "Summary of the email's relevance to the case.",
        "exactContent": "[Complete email conversation, including sender, receiver, date, and body of the email.]",
        "date": "Date of the email"
    },
    "financialRecords": {
        "type": "Financial Records",
        "title": "[Title of the Financial Record]",
        "content": "[Overview of the financial record's relevance to the financial aspects of the case.]",
        "exactContent": "[I want no overviews, no summaries, no paragraphs. Exact Statement of the bank records' relevance to the case, highlighting financial transactions and balances.]",
        "date": "Date of the record"
    },
    "surveillanceFootage": {
        "type": "Surveillance Footage",
        "title": "Location and Date of the Footage",
        "content": "[Description of the footage's relevance to the case events.]",
        "exactContent": "[I don't want summaries, nor paragprah, nor overviews. I want hight details level, very good structure.Timestamped summary of the footage, noting key moments and individuals captured, supplemented by still images or descriptions.]",
        "date": "Date of the recording"
    },
    "medicalRecords": {
        "type": "Medical Records",
        "title": "[Patient Name and Date of the Records]",
        "content": "[Significance of the medical records to the individual's condition or the case.]",
        "exactContent": "[Detailed account of medical visits, diagnoses, treatments, and physician notes, with relevance to case events highlighted.]",
        "date": "Date of the records"
    },
    "policeReport": {
        "type": "Police Report",
        "title": "[Report Number and Incident Date]",
        "content": "Summary of the incident as reported to law enforcement.",
        "exactContent": "[Complete report text, including descriptions of the incident, statements from involved parties and witnesses, and initial findings.]",
        "date": "[Date of the report]"
    },
    "courtDocuments": {
        "type": "Court Document",
        "title": "[Title of the Court Document]",
        "content": "Brief on how the document pertains to the legal proceedings.",
        "exactContent": "[I don't want summaries, nor paragprah, nor overviews. I want hight details level, very good structure.Full document text, including legal arguments, motions, orders, or judgments, formatted according to legal document standards.]",
        "date": "Date of the document"
    },
    "contractAgreements": {
        "type": "Contract Agreement",
        "title": "[Title of the Contract]",
        "content": "[Relevance of the contract to the dispute or case.]",
        "exactContent": "[I don't want summaries, nor paragprah, nor overviews. I want hight details level, very good structure.Complete contract text, including terms, conditions, parties involved, and signatures, with key clauses highlighted.]",
        "date": "Date of the agreement"
    },
    "academicRecords": {
        "type": "Academic Records",
        "title": "[Name of the Institution and Student]",
        "content": "[Overview of the academic records' relevance to the case.]",
        "exactContent": "[Transcripts, diplomas, and other records, detailing courses, grades, and achievements, with any discrepancies or notable achievements highlighted.]",
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
            Only 4 items, extremely detailed, as it is an investigation / law / detective game / with no placeholders. 100% complete : ${Object.values(discoveryTemplates).map(template => JSON.stringify(template, null, 2)).join(',\n')}
        ]
        "oppositionName": "Generate Fictional but realistic name for the Representing Attorney",

    }
    
    Ensure each element reflects the specified complexity and realism for the case's specifics and legal standards.    
    !Make sure it the whole response is JSON !!! No exceptions. Every little detail should be provided without blanks. Every information (cc numbers, everything)
    `;
}

const issueSubpoenaPrompt = (caseInfo, type, justification, entity) => {
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
` : `
Given the case information and the subpoena request details, the court is to decide on granting the subpoena. If the decision is to deny, provide the rationale. If granted, generate a fictitious document relevant to the case, adhering to the provided template with no placeholders, reflecting the complexity and thematic elements corresponding to the case's difficulty level.

Case Information: ${caseInfo} // This should include the case's difficulty level.
Type of Subpoena: ${type.name}
Justification: "${justification}"
Targeted Entity: "${entity}"

Evaluate the justification against the case's difficulty level. Consider the reality of legal processes, including potential corruption or other thematic elements based on the case's difficulty, to decide on granting the subpoena.
Deny the subpoena if the user is trying to mislead / manipulate / move the case in a certain direction.
Don't be easy on granting subpoenas. 
if there is duplicates, deny the subpoena. 

Response structure:
{
  "granted": true or false,
  "rationale": "Provide this only if the subpoena is denied, explaining the decision.",
  "document": ${JSON.stringify(type.template)}
}

The document content must be fictional, extremely detailed, as is a simulation for detective / lawyer game, compelling and complete, designed to enrich the gameplay and educational experience, especially in harder cases where the legal system's complexity and challenges are more pronounced. Also, strictly follow the guidance given by the template : ${type.template}. Remember, I don't want overview / summary, I want details.
You must change the "document" content with very detailed information, not an overview, or a summary. IMPORANT : Because as a detective, I have to be able to see the discovery.
You must leave no placeholders. If you can't find a certain company name in the Case Information, generate one.
`;
    return prompt 
} 

module.exports = {createCasePrompt, issueSubpoenaPrompt}