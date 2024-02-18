const Filter = require('bad-words');
const { discoveryTemplates, lMPrices } = require('../vars/vars');
const filter = new Filter({ placeHolder: '*' });

const createCasePrompt = (uid, caseInfo) => {
    const { lawSystem, additionalKeywords, fieldOfLaw, difficulty, position } = caseInfo;
    

    return `
    Create a comprehensive legal case model within the field of "${fieldOfLaw}" from the perspective of "${position}". The case complexity is defined as "${difficulty}". Incorporate the following details: ${additionalKeywords ? filter.clean(additionalKeywords) : 'No additional Keywords'} under the "${lawSystem}" legal system. As the case complexity increases, so should the detail and nuance of the scenario. Provide specific names, dates, and documents to maintain realism. The case format should be as follows:

{
    "title": "{plaintiff Name} vs {defendant Name}",
    "summary": "Provide a concise overview of the case, highlighting key allegations, defenses, and legal points relevant to ${fieldOfLaw} within the ${lawSystem} context. This summary is intended for the reader's initial understanding.",
    "participants": [
        {
            "name": "{participant Name}",
            "role": "{participant Role}",
            "ctc": {true if participant is ${position} client or is the opposing attorney. Otherwise, false.},
            "alive": {is Alive},
            "subpoena": false,
            "shortDescription": "{participant short Description}"
        }
    ],
    "discoveries": [
      ${Object.values(discoveryTemplates).map(template => JSON.stringify(template, null, 2)).join(',\n')}
    ],
    "oppositionName": "{Realistic opposition Attorney Name}"
}

Guidelines:
- The case model must be entirely in JSON format without exceptions.
- Focus on generating a fictional yet realistic scenario, including participant names and legal documents.
- Limit "discoveries" to four items, providing extensive detail and structure without using placeholders. Include specific dates and relevant information to mimic an investigative or legal strategy game. I don't want overiew or summary of content, but ultra realistic 100% complete content with no placeholders whatsoever.
- Include only human participants in the model. Specifically, add the opposing attorney to the "participants" array, ensuring no companies or non-human entities are represented. The ${position} attorney must not be included in the participants array. But add additional participants initially to make the case interesting.
- Ensure the case reflects the designated complexity, realism, and legal standards accurately.

Note: While the primary focus is on the opposition attorney within the participants array, you may add more human participants following the schema provided to enhance the narrative. Ensure all details are comprehensive, leaving no information unspecified, including credit card numbers and sensitive data as required for the case's depth.
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