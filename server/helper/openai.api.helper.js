const Filter = require('bad-words');
const { discoveryTemplates, lMPrices } = require('../vars/vars');
const filter = new Filter({ placeHolder: '*' });

const createCasePrompt = (uid, caseInfo) => {
    const { lawSystem, additionalKeywords, fieldOfLaw, difficulty, position } = caseInfo;
    

    return `
    !Make sure it the whole response is JSON !!! No exceptions. 
    Create a legal case model in ${fieldOfLaw} as ${position}. The case should be ${difficulty} level, detailed with ${additionalKeywords ? filter.clean(additionalKeywords) : 'No additional Keywords,'} under ${lawSystem}. The more complex the difficulty, the more nuanced the case. Be specific with Names, Dates, and Documents. Keep it realistic. Format:

    {
        "title": "\${plaintiff fictional but realistic name} vs \${defendant fictional but realistic name}",
        "summary": "Concise case overview, including key allegations, defenses, and legal points in ${fieldOfLaw} under ${lawSystem}. This summary is for the viewer/reader",
        "participants": [
            {"name": \${name}, "role": \${role}, "ctc": \${true if participant is ${position} client or is the opposing attorney. Otherwise, false.}, "alive": \${boolean}, "subpoena": false, "shortDescription": \${short description}}
            
    ],
        "discoveries": [
            Only 4 items, extremely detailed and excellently structured (not summary / overview / paragraph), with no placeholders! Provide dates, everything., as it is an investigation / law / detective game / with no placeholders. 100% complete : ${Object.values(discoveryTemplates).map(template => JSON.stringify(template, null, 2)).join(',\n')}
        ]
        "oppositionName": "Generate Fictional but realistic name for the Representing Attorney",

    }
    // YOU CAN ADD MORE PARTICIPANTS FOLLOWING THE GIVEN SCHEMA TO MAKE IT MORE INTERESTING
            // ONLY HUMAN BEINGS. I DONT WANT COMPANIES OR THINGS THAT ARE NOT HUMAN IN MY PARTICIPANTS array.
    Ensure each element reflects the specified complexity and realism for the case's specifics and legal standards.    
    !Make sure it the whole response is JSON !!! No exceptions. Every little detail should be provided without blanks. Every information (cc numbers, everything)
    Add the opposing attorney in participants array.
    `;
}

const tmplt = `"type": "Motion",
"title": "[Generated Title based on the motion's content]",
"content": "A very short summary outlining the motion",
"exactContent": "Title: [Generated Title based on the motion's content]

Introduction:
- Purpose: [Introduction to the motion, including the legal basis for the request.]
- Date: ${new Date().toISOString().split('T')[0]}

Background:
- Case Details: [Details on the case and how it relates to the motion.]
- Relevant Facts: [Key facts from the case that support the motion.]

Argument:
- Legal Framework: [Reference to applicable laws, statutes, and legal precedents.]
- Evidence: [Summary of evidence from the case supporting the motion.]
- Analysis: [Detailed analysis connecting the evidence and legal framework to the argument.]

Conclusion:
- Request: [Specific request or relief being sought through the motion.]
- Court's Decision: [The court's decision on the motion, including any conditions or instructions.]

Dated: "${new Date().toISOString().split('T')[0]}"

Signatory:
- Attorney Name: [{Attorney's Name}]
- On Behalf of: [{Client Name or Entity}]
- Date: ${new Date().toISOString().split('T')[0]}

Notes:
- [Optional] Additional comments or procedural notes related to the motion or its filing.`
"date: new Date().toISOString().split('T')[0]";

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
    "dtls": "[if subpoenaed in array of participants I want this ARRAY but with corresponding information: ['exact name', 'role']]"
    "details": inList ? null : {
      "name": "\${firstName} \${lastName}",
      "role": "Role in the Case",
      "shortDescription": "Relevance of the participant to the case",
      "alive": Boolean
    }
  }
}

Deny the subpoena if it is incoherent, unjustified, duplicates existing information, or if granting it does not further the investigation. Your decision must reflect a comprehensive understanding of the legal and factual elements of the case. Ensure that the response is legally coherent and realistically aligns with the case scenario.
Deny the subpoena if the suboenaed person is not relevant to the case (if the user invents witnesses, anything, fictional characters, etc...)
You are the one in charge of granting or not the subpoena of experts in the case. 
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
  "document": ${JSON.stringify(type.template)},
  "ai_move": [Here you must provide a response to the subpoena, a document like "document" field, but offering a discovery element from your side following the templates. You can choose from the following array : ${JSON.stringify(discoveryTemplates)} or even a motion : ${JSON.stringify(lMPrices)}. In case the response move of the ai, the template must be like the following : ${tmplt}. it can also be testimony. It must be also very well structured.],
}

The document content must be fictional, extremely detailed, as is a simulation for detective / lawyer game, compelling and complete, designed to enrich the gameplay and educational experience, especially in harder cases where the legal system's complexity and challenges are more pronounced. Also, strictly follow the guidance given by the template : ${type.template}. Remember, I don't want overview / summary, I want details.
You must change the "document" content with very detailed information, not an overview, or a summary. IMPORANT : Because as a detective, I have to be able to see the discovery.
You must leave no placeholders. If you can't find a certain company name in the Case Information, generate one.
`;
    return prompt 
} 
  

const fileMotionPrompt = (caseInfo, type, justification, entity) => {
    const mtnprmpt = {
        "type": "Motion",
        "title": "${entity} - [Generated Title based on the motion's content]",
        "content": "A very short summary outlining the motion",
        "exactContent": `
      Title: ${{entity}} - [Generated Title based on the motion's content]
      
      Introduction:
      - Purpose: [Introduction to the motion, including the legal basis for the request.]
      - Date: ${new Date().toISOString().split('T')[0]}
      
      Background:
      - Case Details: [Details on the case and how it relates to the motion.]
      - Relevant Facts: [Key facts from the case that support the motion.]
      
      Argument:
      - Legal Framework: [Reference to applicable laws, statutes, and legal precedents.]
      - Evidence: [Summary of evidence from the case supporting the motion.]
      - Analysis: [Detailed analysis connecting the evidence and legal framework to the argument.]
      
      Conclusion:
      - Request: [Specific request or relief being sought through the motion.]
      - Court's Decision: [The court's decision on the motion, including any conditions or instructions.]
      
      Dated: "${new Date().toISOString().split('T')[0]}"
      
      Signatory:
      - Attorney Name: [{Attorney's Name}]
      - On Behalf of: [{Client Name or Entity}]
      - Date: ${new Date().toISOString().split('T')[0]}
      
      Notes:
      - [Optional] Additional comments or procedural notes related to the motion or its filing.`,
        "date": "${new Date().toISOString().split('T')[0]}"
      }
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

Response must follow the following structure, with no placeholders whatsoever. 
{
  "granted": [true/false based on the above criteria],
  "rationale": "Provide with a clear explanation of the court's decision",
  "document": ${JSON.stringify(mtnprmpt)}
}
Ensure all parts of the document are fully detailed, reflecting a realistic and structured approach as seen in actual legal documents, without using placeholders.

Ensure your decision is justified with a meticulous review of the provided case information and the motion's alignment with legal standards and evidential support.
`;


return openAiPrompt;

}

const SubpoenaMessagePrompt = (subpoenee, caseInfo, message, messageHistory) => {
    const prompt = `You are playing the role of ${subpoenee.role} with the following information : ${subpoenee}. You are asked the following question : ${message.message}. 
    Given the following Case Informatiom : ${caseInfo}.
    Conversation history : ${messageHistory}
    If you are an expert witness, with no conflict of interest, you answer the ${message} in a human way with honesty. 
    If you are the plaintiff / defendant You don't have to say the truth, but stay coherent with the case Information and the Conversation History. The harder the case Difficulty is, the more corrupt and difficult the conversations are. 
    The answer must follow this structure strictly JSON : {
        "text":"response of the subpoenee"
    }
    `

    return prompt;
}

module.exports = {SubpoenaMessagePrompt, createCasePrompt, issueSubpoenaPrompt, fileMotionPrompt}