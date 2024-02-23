const Filter = require('bad-words');
const { discoveryTemplates, lMPrices } = require('../vars/vars');
const filter = new Filter({ placeHolder: '*' });

const createCasePrompt = (uid, caseInfo, pos) => {
    const { lawSystem, additionalKeywords, fieldOfLaw, difficulty } = caseInfo;
    

    return `
    Create a comprehensive legal case model within the field of "${fieldOfLaw}" from the perspective of "${pos}". The case complexity is defined as "${difficulty}". Incorporate the following details: ${additionalKeywords ? filter.clean(additionalKeywords) : 'No additional Keywords'} under the "${lawSystem}" legal system. As the case complexity increases, so should the detail and nuance of the scenario. Provide specific names, dates, and documents to maintain realism. The case format should be as follows:

{
    "title": "{plaintiff Name} vs {defendant Name}",
    "summary": "Provide a concise overview of the case, highlighting key allegations, defenses, and legal points relevant to ${fieldOfLaw} within the ${lawSystem} context. This summary is intended for the reader's initial understanding.",
    "participants": [
        {
            "name": "{participant Name}",
            "role": "{participant Role}",
            "ctc": {true if participant is ${pos} client or is the oppositionName attorney. Otherwise, false.},
            "alive": {is Alive ?},
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
- Include only human participants in the model. Specifically, add the oppositionName's attorney to the "participants" array, ensuring no companies or non-human entities are represented. The ${pos} attorney must not be included in the participants array. But add additional participants initially to make the case interesting. Don't add to the participants array the ${pos} attorney.
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
    Conduct a thorough analysis of a subpoena request directed at a specific participant in the context of the given case details. Your primary objective is to critically assess the request based on the subpoena's type, the provided justification, its relevance and coherence with the case, and compliance with legal norms and standards.

    Subpoena Request Analysis:
    - Request Type: 'Participant', specified as ${entity}.
    - Justification for Subpoena: Provided as '${justification}'.
    - Pertinent Case Details: Outlined in '${caseInfo}'.
    
    Your analysis must determine whether the subpoena request fulfills the legal criteria for issuance. This involves verifying the presence of the requested participant within the case details provided in '${caseInfo.participants}'. Should the participant be unlisted, you are tasked with creating a detailed profile for a new, plausible fictitious participant. Conversely, if the participant is already included, acknowledge their existing role within the case.
    
    The decision to grant or deny the subpoena should hinge on:
    - The coherence between the subpoena type and the justification provided.
    - The subpoena's relevance and justification in relation to the case.
    - Avoidance of redundancy by not duplicating information already available in the case details.
    - Legal and factual incoherence, or lack of substantial justification.
    
    Your response should adhere to the following JSON format for clarity and precision:
    
    {
      "granted": "Boolean indicating the decision to grant or deny the subpoena",
      "rationale": "A comprehensive explanation supporting the decision, grounded in legal and factual analysis of the case.",
      "participant": {
        "inList": "Boolean indicating if the participant is already mentioned in the case details (${caseInfo.participants})",
        "details": "If the participant is not in the list, provide a fabricated yet plausible profile including: name, role in the case, a brief description of their relevance like the following format : {
            "name: "fictif name",
            "role": "role of participant",
            "shortDescription": "short description of the participant"
        }. If in the list, this field must contain the following object : {'exactName':'exact name as stated', 'role': 'role of the participant as stated'} "
      }
    }
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
  "ai_move": [Here you must provide a response to the subpoena, a document like "document" field, but offering a discovery element from your side following the templates. You can choose from the following array : ${JSON.stringify(discoveryTemplates)} or even a motion : ${JSON.stringify(lMPrices)}. In case the response move of the ai, the template must be like the following : ${tmplt}. it can also be testimony. It must be also very well structured. The content must defend the side represented by ${caseInfo.oppositionName}],
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
  const prompt = `
  YOU ARE IN A DEPOSITION. In this immersive legal simulation, you assume the identity of a character deeply involved in a legal case, designated as "${subpoenee.role}". This role comes with a comprehensive background profile: ${subpoenee}, and a specific task: ${message}.
  
  ### Contextual Background Information:
  - **Case Details:** Explore the intricacies of the case, ${caseInfo}. Pay close attention to the key figures, especially caseInfo.owners[0], who is pivotal to the query at hand.
  - **Conversation History:** Keep in mind the dialogue and events that have transpired, ${messageHistory}, ensuring your responses contribute to a coherent and continuous storyline.
  
  ### Role-Specific Guidelines for Response:
  - **Expert Witness:** Your input should be grounded in honesty and professional integrity, offering expert insights or factual clarifications on the inquiry (${message}), free from any conflicts of interest.
  - **Plaintiff/Defendant:** Although full transparency is not required, your statements should remain consistent with the established facts (${caseInfo} and ${messageHistory}). Your approach to disclosure should be strategic, aimed at advancing your role's interests within the framework of the case. As the narrative evolves, the complexity may increase, presenting moral quandaries and demanding a nuanced balance between honesty and strategy.
  - **Engagement with the Inquiry:** Address the question or statement (${message}) directly. Your response, while required to be in alignment with your role, should also be human-like and engaging, potentially incorporating strategic missteps or choosing silence as a tactical response.
  - Give very short and human answers, very realistic, and generate fictif information on the go, but it must be coherent. 
  - Please pay attention to the Case Details to be coherent.
  Your response must be meticulously formatted in JSON, capturing the essence of your role's perspective and the provided context in a manner that's engaging, potentially helpful (or not) for the unfolding case narrative:
  \`
  {
    "message": "Your detailed response, articulated from your character's viewpoint, ensuring it is compelling, authentically human, and aligned with the narrative's demands."
  }
  \`
  `;

    return prompt;
}

const endDepositionPrompt = (messageHistory) => {
    return `
    Given this deposition transcript, draft a legeal deposition transcript formatted text. The response must be like the followng, strictly JSON : 
    {
        "document": {
            "type": "Testimony",
            "title": "Witness Name or Identifier",
            "content": "Essential summary of the testimony, emphasizing its impact on the case.",
            "exactContent": "Witness: '{{Name}}'\nDate: '{{YYYY-MM-DD}}'\n\nTranscript: Draft Transcript from the following record : ${messageHistory}",
            "date": "YYYY-MM-DD format"
          },
    }
    `
}

module.exports = {SubpoenaMessagePrompt, createCasePrompt, issueSubpoenaPrompt, fileMotionPrompt}