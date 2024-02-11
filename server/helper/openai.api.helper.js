const Filter = require('bad-words');
const filter = new Filter({ placeHolder: '*' });

const discoveryTemplates = {
    "document": {
      "type": "Document",
      "title": "Explicit Title Reflecting Document Subject",
      "content": "Concise summary highlighting the document's relevance to the case.",
      "exactContent": "Title: '{{Document Title}}'\nDate: '{{YYYY-MM-DD}}'\n\nOverview:\n{{Brief overview of document relevance and content.}}\n\nDetailed Analysis:\n{{Point-by-point detailed analysis, including data points, names, dates, and locations.}}\n\nImplications:\n{{Discussion on how this document affects the case.}}\n\nAttachments:\n{{List of attached images, charts, or relevant documents with brief descriptions.}}",
      "date": "YYYY-MM-DD format"
    },
    "testimony": {
      "type": "Testimony",
      "title": "Witness Name or Identifier",
      "content": "Essential summary of the testimony, emphasizing its impact on the case.",
      "exactContent": "Witness: '{{Name}}'\nDate: '{{YYYY-MM-DD}}'\n\nTranscript:\nQ1: '{{Question 1}}'\nA1: '{{Answer 1}}'\nQ2: '{{Question 2}}'\nA2: '{{Answer 2}}'\n{{Additional Q&A as necessary}}\n\nConclusion:\n{{Key takeaways from the testimony.}}\n\nNotes:\n{{Examiner's observations or relevant comments.}}",
      "date": "YYYY-MM-DD format"
    },
    "investigationReport": {
      "type": "Investigation Report",
      "title": "Investigation Focus and Report Number",
      "content": "Overview summarizing key findings and their implications.",
      "exactContent": "Report Title: '{{Report Title}}'\nDate: '{{YYYY-MM-DD}}'\n\nMethodology:\n{{Description of investigation techniques and tools used.}}\n\nFindings:\n{{Detailed account of evidence found, including photographs, diagrams, and key observations.}}\n\nConclusions:\n{{Summary of implications for the case.}}\n\nRecommendations:\n{{Suggested next steps based on findings.}}",
      "date": "YYYY-MM-DD format"
    },
    // Following the same pattern for other document types
    "email": {
      "type": "Email",
      "title": "Email Subject Line",
      "content": "Summary of the email's relevance to the case.",
      "exactContent": "Date: '{{YYYY-MM-DD}}'\nFrom: '{{Sender}}'\nTo: '{{Receiver}}'\nSubject: '{{Subject Line}}'\n\nBody:\n{{Full email body text}}\n\nFollow-up:\n{{Response emails if any, with full headers and body.}}\n\nSummary:\n{{Key points and relevance to the case.}}",
      "date": "YYYY-MM-DD format"
    },
    "financialRecords": {
      "type": "Financial Records",
      "title": "Record Type and Account Number",
      "content": "Analysis of the record's significance, focusing on financial implications.",
      "exactContent": "Account Number: '{{Account Number}}'\nStatement Period: '{{Start Date}} to {{End Date}}'\n\nTransactions:\n- Date: '{{Transaction Date}}', Description: '{{Transaction Description}}', Amount: '{{Amount}}', Balance: '{{Running Balance}}'\n{{Repeat for each transaction}}\n\nSummary:\n{{Analysis of financial activity's impact on the case.}}",
      "date": "YYYY-MM-DD format"
    },"surveillanceFootage": {
        "type": "Surveillance Footage",
        "title": "Location and Timestamp of Footage",
        "content": "Contextual overview of the footage's role in the investigation.",
        "exactContent": "Location: '{{Location}}'\nDate and Time: '{{YYYY-MM-DD HH:MM}}'\n\nEvents:\n{{Timestamped summary of key moments and individuals identified, with detailed descriptions of actions.}}\n\nAnalysis:\n{{Significance of footage to case investigation, including any discrepancies or notable behaviors observed.}}",
        "date": "YYYY-MM-DD format"
      },
      "medicalRecords": {
        "type": "Medical Records",
        "title": "Patient Name and Record Number",
        "content": "Summary of medical history's relevance to case events.",
        "exactContent": "Patient: '{{Patient Name}}'\nRecord Date: '{{YYYY-MM-DD}}'\n\nVisits:\n{{Date and summary of each visit, including diagnosis, treatment provided, and physician notes.}}\n\nSummary:\n{{Medical history overview with relevance to the case highlighted, including any discrepancies or notable conditions.}}",
        "date": "YYYY-MM-DD format"
      },
      "policeReport": {
        "type": "Police Report",
        "title": "Incident Report Number",
        "content": "Brief overview of the incident and initial findings.",
        "exactContent": "Report Number: '{{Report Number}}'\nIncident Date: '{{YYYY-MM-DD}}'\n\nIncident Description:\n{{Detailed narrative of the event, including involved parties, witness statements, and initial findings.}}\n\nFindings:\n{{Initial observations, evidence collected, and any immediate conclusions drawn.}}\n\nPhotos/Diagrams:\n{{Descriptions of included visual aids, if any, with relevance to the findings.}}",
        "date": "YYYY-MM-DD format"
      },
      "courtDocuments": {
        "type": "Court Document",
        "title": "Document Name and Case Number",
        "content": "Outline of the document's legal significance.",
        "exactContent": "Document Title: '{{Title}}'\nCase Number: '{{Case Number}}'\n\nLegal Text:\n{{Full document content, with critical sections highlighted and annotated for clarity.}}\n\nAnalysis:\n{{Commentary on document implications for the case, including any legal precedents or arguments presented.}}\n\nAttachments:\n{{Any relevant legal briefs, exhibits, or supporting documents listed with brief descriptions.}}",
        "date": "YYYY-MM-DD format"
      },
      "contractAgreements": {
        "type": "Contract Agreement",
        "title": "Contract Title and Parties Involved",
        "content": "Summary of the contract's purpose and its relevance to the dispute.",
        "exactContent": "Contract Title: '{{Title}}'\nParties Involved: '{{Names of Parties}}'\nDate: '{{YYYY-MM-DD}}'\n\nTerms:\n{{Detailed enumeration of contract terms, conditions, and obligations, with key clauses highlighted and their implications discussed.}}\n\nSignatures:\n{{Signatures of all parties involved, with dates.}}\n\nAnalysis:\n{{Examination of the contract's relevance to the dispute, including any points of contention.}}",
        "date": "YYYY-MM-DD format"
      },
      "academicRecords": {
        "type": "Academic Records",
        "title": "Institution Name and Student Identifier",
        "content": "Insight into the records' pertinence to the investigation.",
        "exactContent": "Student: '{{Student Name}}'\nInstitution: '{{Institution Name}}'\nDate: '{{YYYY-MM-DD}}'\n\nRecords:\n{{Detailed list of courses, grades, and academic achievements, with any discrepancies or notable achievements highlighted.}}\n\nSummary:\n{{Overview of academic performance with emphasis on relevance to the case, including any patterns or irregularities observed.}}",
        "date": "YYYY-MM-DD format"
      }
      // Any additional document types would follow the same detailed and dynamic structure.
    // Add additional templates for other document types as required, following the dynamic structure outlined above.
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
            Only 4 items, extremely detailed and excellently structured (not summary / overview / paragraph), with no placeholders, as it is an investigation / law / detective game / with no placeholders. 100% complete : ${Object.values(discoveryTemplates).map(template => JSON.stringify(template, null, 2)).join(',\n')}
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

const fileMotionPrompt = (caseInfo, type, justification, entity) => {
    const openAiPrompt = `
As the court reviewing a motion request, critically assess the provided information to make an informed decision. The motion request includes:

- Type of Motion: ${type}
- Title: ${entity}
- Justification: ${justification}
- Case Information: ${JSON.stringify(caseInfo)}

In your evaluation, consider:
- The coherence and completeness of the form information.
- Whether the type of evidence mentioned is present within the caseInfo.discoveries array.
- How the case's difficulty level, as described in caseInfo.discoveries, impacts the motion's likelihood of success.
- The reasoning's strength and its foundation on solid evidence and legal principles.
- Remaining impartial and not swayed by external factors, including any implied threats or unsubstantiated claims.
- The validity of the argument, ensuring all claims are supported by evidence. If a claim made by the user isn't backed by information in the caseInfo.discoveries array or contradicts known facts, the motion should not be approved.

Your response should mirror the seriousness and structure of a legal document, providing a clear, evidence-based decision.

Response must follow the following structure:
{
  "granted": [true/false based on the above criteria],
  "rationale": "Provide with a clear explanation of the court's decision",
  "document": {
    "type": "Motion",
    "title": "${entity} - [Generated Title based on the motion's content]",
    "content": "A very short summary outlining the motion",
    "exactContent": "[Introduction] [Introduction to the motion, including the legal basis for the request.]\\n\\n[Background] [Details on the case and how it relates to the motion.]\\n\\n[Argument:] [A detailed argument for the motion, including references to applicable laws, precedents, and evidence from the case.]\\n\\n[Conclusion] [The court's decision on the motion, including any conditions or instructions.]\\n\\nDated: ${new Date().toISOString().split('T')[0]}",
    "date": "${new Date().toISOString().split('T')[0]}"
  }
}
Ensure all parts of the document are fully detailed, reflecting a realistic and structured approach as seen in actual legal documents, without using placeholders.

Ensure your decision is justified with a meticulous review of the provided case information and the motion's alignment with legal standards and evidential support.
`;


return openAiPrompt;

}

module.exports = {createCasePrompt, issueSubpoenaPrompt, fileMotionPrompt}