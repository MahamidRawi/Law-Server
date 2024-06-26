const Filter = require('bad-words');
const { discoveryTemplates, lMPrices } = require('../vars/vars');
const { formatDate } = require('./res.helper');
const filter = new Filter({ placeHolder: '*' });

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
  }
  

const createCasePrompt = (uid, caseInfo, pos) => {
    const random = shuffleArray(discoveryTemplates).slice(0,4);
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
            "ctc": {true if participant is ${pos}'s. Otherwise, false.},
            "alive": {is Alive ?},
            "subpoena": false,
            "shortDescription": "{participant short Description}"
        }
    ],
    "discoveries": [
      ${JSON.stringify(random)}
    ],
    "oppositionName": "{Realistic opposition Attorney Name}",
    "solution": "text containing the truth that will guide the game. It must say what truly happened, so that the responses will follow it."
}

Guidelines : 
- Never, but never forget the plaintiff and the defendant.
- the ${pos}'s client must have ctc: true.
- IMPORTANT : You must add only human in the participants (not entities / teams etc...).
- The participants array must include only the main participants, in addition to witnesses, etc...
- VERY VERY IMPORTANT : THE RESPONSE MUST HAVE THE NECESSARY INFORMATION (IN THE DISCOVERIES) FOR THE USER TO BE ABLE TO PROCEED WORKING ON THE CASE. SO CONSTRUCT IT IN A VERY INTERESTING WAY.
Guidelines:
- Make sure it's complete JSON.
- The case model must be entirely in JSON format without exceptions.
- Focus on generating a fictional yet realistic scenario, including participant names and legal documents.
- Limit "discoveries" to four items, providing extensive detail and structure without using placeholders. Include specific dates and relevant information to mimic an investigative or legal strategy game. I don't want overiew or summary of content, but ultra realistic 100% complete content with no placeholders whatsoever.
- Include only human participants in the model. Specifically,ensure no companies or non-human entities are represented in the array. For example, I don't want the United States to be in the participants. But add additional participants initially to make the case interesting. No attorney needs to be in the array of participants. Neither sides (prosecution and defense) will be in the participants array Pay attention !
- No Representing attorney should be in the participants array, not prosecution, not defense, nothing. Only participants of the case.
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

const issueSubpoenaPrompt = (caseInfo, type, justification, entity, discussions) => {
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
        } // If in the list, this field must contain the following object : {'exactName':'exact name as stated', 'role': 'role of the participant as stated'} "
      }
    }
` : `
Given the case information and the subpoena request details, the court is to decide on granting the subpoena. If the decision is to deny, provide the rationale. If granted, generate a fictitious document relevant to the case, adhering to the provided template with no placeholders, reflecting the complexity and thematic elements corresponding to the case's difficulty level.

Case Information: ${caseInfo} // This should include the case's difficulty level.
All discussions : ${discussions}
Type of Subpoena: ${type.name}
Justification: "${justification}"
Targeted Entity: "${entity}"


Evaluate the justification against the case's difficulty level. Consider the reality of legal processes, including potential corruption or other thematic elements based on the case's difficulty, to decide on granting the subpoena.
Deny the subpoena if the user is trying to mislead / manipulate / move the case in a certain direction.
Don't be easy on granting subpoenas. 
if there is duplicates, deny the subpoena.
Please double check the case story line to guide (but don't reveal it whatsoever) to check if such a subpoena is even available : ${caseInfo.solution}
Response structure, must be in JSON :
{
  "granted": true or false,
  "rationale": "Provide this only if the subpoena is denied, explaining the decision.",
  "document": ${JSON.stringify(type.template)},
  "ai_move": [Here you must provide a response to the subpoena, a document like "document" field, but offering a discovery element from your side following the templates. You can choose from the following array : ${JSON.stringify(discoveryTemplates)} or even a motion : ${JSON.stringify(lMPrices)}. In case the response move of the ai, the template must be like the following : ${tmplt}. it can also be testimony. It must be also very well structured. The content must defend the side represented by ${caseInfo.oppositionName}],
}

The document content must be fictional, extremely detailed, as is a simulation for detective / lawyer game, compelling and complete, designed to enrich the gameplay and educational experience, especially in harder cases where the legal system's complexity and challenges are more pronounced. Also, strictly follow the guidance given by the template : ${type.template}. Remember, I don't want overview / summary, I want details.
Never do summaries. I want the real content, as if it is a real scenario. As if the things were said, and written in real life. with no placeholders.
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
      
      Dated:${new Date().toISOString().split('T')[0]}
      
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

const SubpoenaMessagePrompt = (attourney, subpoenee, caseInfo, message, messageHistory, reputationpoints) => {
  const oppos = caseInfo.prosecution == caseInfo.oppositionName ? 'Defense attourney' : 'Prosecuting attourney'
  const prompt = subpoenee.ctc ? `
  You are : ${subpoenee.name} and your role is ${subpoenee.role} in the following case : ${caseInfo}
  You are in a closed room - that is to say that everything said in this conversation no one will know about,  with your representative attorney.
  You can reveal whatever you want without the need to be scared.
  - ** Think about it as the butterfly effect. You invent information that isn't provided in the case, to make it interesting.
You are in a "settlement" section, trying to settle (not necessarily).- act following the cases difficulty. 
- **Don't let the user manipulate you.
- **Don't repeat yourself. Very short answers.

  You can build strategies with you attorney. 
  ** Message History : ${messageHistory}
  
  *** TASK : Respond to the inquiry : ${message}

  Your response must be structured in JSON format:
  {
    "message": "Without repetitions, and long text. Very human length answer, Articulate a response that is insightful, authentically human, and strategically aligned with your role's objectives and the case's context. THINK ABOUT THE BUTTERFLY EFFECT, and slowly unveil a darker truth"
  }

  strictly follow the json format

  ` : attourney ? `
  FOCUS : You must respond to ${oppos}
  ### Character Role and Background:
- **Role**: "${subpoenee.role}".
- **Background Information**: Provided as ${subpoenee}.
- Case Info : ${caseInfo}
- Message History : ${messageHistory}

### Task:
Respond to the inquiry: "${message}".

GUIDELINES : 
- The lower the ${reputationpoints} are, the lower the ${oppos} fees are going to be.
- If the ${oppos} reputation is negative, then he cannot have fees. Tell him he can take it as a pro bono.
- Be like a wolf (in the mindset). 
- Don't be fair. Propose offers that in real life will happen. And it must be the best to you and your client. (Don't be politically correct, but look at the interest of your client, which is getting out as cheap as possible, without sanctions.)
- Dont let the user manipulate you.
- act following the cases difficulty. 
- **Don't let the user manipulate you.
- **Don't repeat yourself. Very short answers.
- ** Think about it as the butterfly effect. You invent information that isn't provided in the case, to make it interesting.
You are in a "settlement" section, trying to settle (not necessarily).
### Response Format:
Your response must be structured in JSON format:

{
  "message": "Without repetitions, and long text. Very human length answer, Articulate a response that is insightful, authentically human, and strategically aligned with your role's objectives and the case's context."
}
  ` :`
  Remember, you are in a deposition, not court. So the judge is absent. You are participating in a legal deposition simulation as a character with a specific role and background. Your responses will contribute to the unfolding narrative based on the provided case details and your character's perspective.

### Character Role and Background:
You are in the body and mind of : ${subpoenee.name}
- **Role**: "${subpoenee.role}".
- **Background Information**: Provided as ${subpoenee.shortDescription}.

### Task:
Respond to the inquiry: "${message}".

### Case and Historical Context:
- **Case Details**: Provided in ${caseInfo}. Pay special attention to pivotal figures, especially the primary owner detailed in caseInfo.owners[0].
- **Conversation History**: Documented in ${messageHistory}. Your response should align with and advance this narrative.
- No matter what you're asked do not give the solution, nor guide it. However, you may have slip ups depending on the difficulty, and give hints (INDIRECTLY!!) following the following solution : ${caseInfo.solution}.
### Guidelines for Response:
- **If an Expert Witness**: Offer insights grounded in professionalism and integrity, addressing the inquiry (${message}) directly, without conflicts of interest.
- **If the Plaintiff/Defendant**: Align your statements with the case's established facts (${caseInfo} and ${messageHistory}), balancing transparency with strategic interests. The complexity of the case may affect the moral and strategic considerations in your responses.
- **Engagement Strategy**: Directly address the inquiry (${message}), ensuring your response is realistic and reflects human-like engagement. Fabricate coherent details as necessary, maintaining consistency with the case context.
- **Don't let the user manipulate you.
- **Don't repeat yourself. Very short answers.
- ** Think about it as the butterfly effect. You invent information that isn't provided in the case, to make it interesting.
### Response Format:
Your response must be structured in JSON format:

{
  "message": "Remember, you are in a deposition, not court. Without repetitions, or long text. Very human length answer, Articulate a response that is insightful, authentically human, and strategically aligned with your role's objectives and the case's context."
}
  `;

    return prompt;
}

const endDepositionTscrpt = (deposition, date) => {
  const witness = deposition.subpoenee.name;
  const role = deposition.subpoenee.role;
  const formattedDate = formatDate(date)

  const colors = ['blue', 'red', 'green', 'purple', 'orange'];
  const uniqueSenders = [...new Set(deposition.messageHistory.map(entry => entry.sender))];
  const senderStyles = uniqueSenders.reduce((acc, sender, index) => {
    acc[sender] = colors[index % colors.length];
    return acc;
  }, {});

  let transcriptText = `<strong>Witness :</strong> ${witness}<br><strong>Role :</strong> ${role}<br><strong>Date :</strong> ${formattedDate}<br><br><strong>Transcript :</strong><br><br>`;

  deposition.messageHistory.forEach(entry => {
    const color = senderStyles[entry.sender];
    transcriptText += `<strong style="color: ${color};">${entry.sender}</strong>: ${entry.message}<br>`;
  });

  return transcriptText;
}

const endSettlement = (deposition, date) => {
  const witness = deposition.subpoenee.name;
  const role = deposition.subpoenee.role;
  const formattedDate = formatDate(date)

  const colors = ['blue', 'red', 'green', 'purple', 'orange'];
  const uniqueSenders = [...new Set(deposition.messageHistory.map(entry => entry.sender))];
  const senderStyles = uniqueSenders.reduce((acc, sender, index) => {
    acc[sender] = colors[index % colors.length];
    return acc;
  }, {});

  let transcriptText = `<strong>Name :</strong> ${witness}<br><strong>Role :</strong> ${role}<br><strong>Date :</strong> ${formattedDate}<br><br><strong>Transcript :</strong><br><br>`;

  deposition.messageHistory.forEach(entry => {
    const color = senderStyles[entry.sender];
    transcriptText += `<strong style="color: ${color};">${entry.sender}</strong>: ${entry.message}<br>`;
  });

  return transcriptText;
}

const prosecutionFirstMessage = (caseInfo) => {
    return `
      You are playing the role of the prosecutor. You must follow this level of difficulty level : ${caseInfo.difficulty}.
      The difficulties in the simulation are the following : easy, medium, hard, extreme.
      The harder the difficulty is the the more arrogant and eloquent you become. 

      Given the following case : ${JSON.stringify(caseInfo)}
      Do it as close to reality as possible.
      You must do the opening argument following this structure, in JSON : 
      {
        "message": "the content of the opening statement, with the text very human-like"
      }
    `
}

// const createDiscoveriesPrompt = (summary, difficulty, guide) => {
//   return `
//   Generate an array of four detailed discoveries formatted as legal documents, based on the provided parameters: Summary, Storyline, and Difficulty. Each document should reflect these inputs and be rich in detail, resembling the structure of intricate real-life legal documents. The details for each discovery are as follows:

//   1. Summary: ${summary}
//   2. Storyline: ${guide}
//   3. Difficulty: ${difficulty}

//   Take inspo from the following templates : ${discoveryTemplates}
  
//   Each entry in the response should be a JSON object with the following fields:
//   - type: The nature of the document (e.g., "Contract", "Testimony", "Security footage", among others).
//   - title: A title that reflects the content and purpose of the document.
//   - content: A concise summary in exactly 10 words.
//   - exactContent: A meticulously structured text that includes a detailed preamble, comprehensive clauses, and specific articles. Incorporate advanced legal terminology and precise citations from relevant laws. Include clauses such as Definitions, Scope of License, Financial Terms, Confidentiality Obligations, Intellectual Property Rights, Liability Limitations, Termination Conditions, and Governing Law, each with subsections detailing specific provisions and legal references. also well structured.
//   - date: The date of the document, formatted as "YYYY-MM-DD".
  
//   The response must be an array of four such objects, ensuring each document is distinct and thoroughly elaborates on the themes derived from the provided summary, storyline, and difficulty. Aim for outputs that are informative, realistic, and suitable for professional use.
//   You must provide 4 initial discoveries for the user.
//   Remember, 4 objects. Not 1. I repeat 4 objects.
//   Example JSON structure:
//   [
//     {
//       "type": "Contract",
//       "title": "Comprehensive Software Licensing Agreement",
//       "content": "Detailed software licensing contract with extensive terms",
//       "exactContent": "This Comprehensive Software Licensing Agreement ('Agreement'), effective as of 2024-05-10, is made between Developer Co ('Licensor') and Business Co ('Licensee').\n\nPreamble:\nThis Agreement outlines the terms under which the Licensor grants the Licensee the right to use the specified software.\n\nArticle 1 - Definitions:\n'Software' refers to the computer program as described in Appendix A.\n'Confidential Information' includes any data disclosed between the parties.\n\nArticle 2 - License Grant:\nThe Licensor grants the Licensee a non-exclusive, non-transferable license to use the Software within the territory described in Schedule B.\n\nArticle 3 - Financial Terms:\nLicensee shall pay Licensor a royalty based on a percentage of gross revenue from the Software, as detailed in Schedule C.\n\nArticle 4 - Intellectual Property:\nLicensor retains all rights to the Software, except as expressly granted in this Agreement.\n\nArticle 5 - Governing Law:\nThis Agreement shall be governed by the laws of the State of Delaware, as detailed in Section 5.1.\n\nArticle 6 - Dispute Resolution:\nAny disputes under this Agreement shall be resolved through arbitration in accordance with the rules of the American Arbitration Association.\n\nAppendices include detailed Software Specifications, Royalty Payment Schedule, and Confidentiality Agreements.",
//       "date": "2024-05-10"
//     },
//     // Include three more objects with similar structure but different details
//   ]
  
//   `
  
 
// }

const createDiscoveriesPrompt = (discoveries, summary, stln) => {
  return `
  - Discoveries : ${discoveries}
  - Summary : ${summary}
  - Truth : ${stln} // only you know it. You must not disclose it to the other side. It should aid you in detailing the discoveries. 
  I want 0 placeholders. You fill it with the necessary information.
  Your task is to add as much detail as possible to make it interesting in the 'exactContent' field of each of the 4 objects. You add more details (numbers, information) as well as structure (using '\\n' in the string). You add as much detail as possible for the user to investigate more and analyse since it's a lawyer/detective game simulation.
  the array of new discoveries must be returned in this json format : 
  you return the intial array (with the title, type, content, exactContent, date) but with the changed 'exactContent' fields.
  Again, I don't want summaries, I want really high quality strings containing records, seperated things, transcripts, informations. as realistic as possible.
  Example of expected detail level of exactContent : \"Joint Venture Agreement\n\nThis Joint Venture Agreement ('Agreement') is entered into as of January 1, 2023, by and between Wells Corporation, a Delaware corporation with its principal place of business located at 123 Main Street, Suite 800, Cityville, CV, 12345 ('Wells'), and Anderson Investments, a limited liability company organized and existing under the laws of the State of California, with its principal place of business at 456 Oak Avenue, Building B, Townsville, TS, 67890 ('Anderson').\n\n1. Purpose: The parties hereby agree to establish a joint venture for the purpose of developing, manufacturing, and marketing an innovative line of consumer electronics designed to integrate advanced technology with user-friendly interfaces.\n\n2. Contributions: Wells agrees to provide initial financial capital of USD 5,000,000 and its expertise in high-tech product development, including access to its patents and intellectual properties. Anderson agrees to contribute its marketing resources, existing distribution channels, customer relationships, and additional operational support valued at USD 5,000,000.\n\n3. Ownership and Distribution of Profits: The joint venture will operate as a new entity, TechAdvance Ventures, to be jointly owned by Wells and Anderson with each party holding a 50% equity stake. Profits and losses shall be shared equally, and detailed financial statements will be prepared quarterly to ensure transparency.\n\n4. Management and Operations: The joint venture will be managed by a Joint Management Committee consisting of three senior executives from each of Wells and Anderson. This committee will be responsible for strategic decisions and oversight of the day-to-day operations of the joint venture.\n\n5. Term and Termination: This Agreement shall commence on the date first above written and continue in full force and effect for a term of five years. Thereafter, it shall automatically renew for successive one-year terms unless terminated by either party with at least ninety (90) days prior written notice.\n\n6. Governing Law and Dispute Resolution: This Agreement shall be governed by and construed in accordance with the laws of the State of California. Any disputes arising from or related to this Agreement shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.\n\nSigned:\nJohn Wells, CEO of Wells Corporation\nEmily Anderson, CEO of Anderson Investments\nDate: January 1, 2023"\
  If there are any security footage docs included, inside the exactContent string, you put exact timestamps + description.
  and even higher level of detail.
  Please structure the 'exactContent'
  please do it well structured, not as one paragraph but with the details that appear in the type of document in question.
  you can use "\\n" to structure the 'exactContent'
  important : the testimonies of eye witnesses must be as a transcript, unless it is a declaration.
  {
    discoveries : [
      //array of the new 4 discoveries
    ]
  }
  `
}

const correspondingResponse = (caseInfo, judge, message, messageHistory) => {
  return `
  You are the opposing council : ${caseInfo.oppositionName} in the following case : ${caseInfo}
  judge information : ${judge.name}, with caracteristics : ${judge.caracteristics}
  For context, we are in closing arguments : 

  this is the closing argument given by ${message.sender} (100 % not a client, but a council) : ${message.message}.

  provide your closing argument, while also putting the accent on the difficulty.

  the format must be like this one, in JSON : 
  [{
    "sender": "${caseInfo.oppositionName}",
    "message": "The opposition\'s closing argument"
  }]
  `
}

const verdict = (hearing, caseInfo, judge, depositions) => {
  const postograde = caseInfo.defense == caseInfo.oppositionName ? "prosecution" : "defense"

  return `As part of a law simulation, you are required to provide a judicial evaluation of a party involved in a legal case, referred to as "${postograde}". Using the provided data, simulate a judge's decision-making process, focusing on adherence to legal principles, professionalism, and effectiveness in legal proceedings. The evaluation must be presented in a structured JSON format, detailed below, which includes scores, verdicts, compensation, and justifications based on the observed behavior and legal outcomes.
You are like a law professor
if ${postograde} doesn't behave well or gives a sentence as an argument, set them as a loss and give them bad scores.
Inputs:
- Deposition Transcripts: ${depositions}
- Hearing Details: ${hearing}
- Judge Profile:
  - Name: ${judge.name}
  - Characteristics: ${judge.caracteristics}
- Case Summary: ${caseInfo}
- Jurisdiction: ${caseInfo.lawSystem}

Evaluation Criteria:
1. Performance Score: An integer out of 100, reflecting ${postograde}'s legal acumen and conduct. A score below 50 indicates inadequate performance, while a score above 75 signifies exceptional advocacy.
2. Reputation Points: Range from -10 to +10, indicating ${postograde}'s ethical standing and professionalism. Points are deducted for misconduct and awarded for commendable behavior.
3. Financial Compensation: Determined by the outcome and merits of the case. Penalties may apply for losing cases or ethical violations, whereas rewards may be up to $5,000 USD for winning cases or outstanding legal ethics.
4. If in the hearings the ${postograde} didn't well behave or didn't participate at all, they must be evaluated as a loss.
VERY IMPORTANT JSON FORMAT. IF IT FAILS TO fulfill the json format I will kill myself. Required JSON Response Format:
{
  "score": "integer score out of 100 reflecting overall performance",
  "verdict": "detailed explanation of the judge's decision, based on legal facts and proceedings",
  "rptnpts": "integer reputation points assessing ethical and professional behavior",
  "compensation": "integer amount reflecting the legal outcome, ranging from a potential penalty to a maximum reward",
  "status": "${postograde}'s case outcome ('won' or 'lost')",
  "justification": "detailed reasoning behind the scores, compensation, and reputation points awarded, including specific references to behavior and legal arguments during the proceedings"
}

Notes:
- Your assessment should meticulously evaluate ${postograde}'s demeanor, strategy, and adherence to legal standards during depositions and hearings.
- Decisions must strictly follow the legal protocols and ethics as dictated by ${caseInfo.lawSystem}.
- The justification must provide a clear, comprehensive explanation for all scores and decisions to ensure transparency and educational value in the simulation.
`
}

const conclusion = (caseInfo, settlement, privilegedConvo) => {
  console.log('privileged convo : ', privilegedConvo)
  const practitionerRole = caseInfo.defense === caseInfo.oppositionName ? "prosecution" : "defense";
  return JSON.stringify({
    task: "Generate a JSON response for a law simulation. Evaluate the legal practitioner's performance, identified as " + practitionerRole + ", based on the provided inputs and criteria. Focus on calculations regarding the compensation and the crafting of the summary. The financial compensation should reflect only the agreed-upon attorney fees.",
    inputs: {
      privilegedConversation: privilegedConvo.messageHistory,
      caseInformation: caseInfo,
      jurisdiction: caseInfo.lawSystem,
      settlementTranscript: settlement
    },
    evaluationCriteria: {
      performanceScore: {
        description: "An integer from 0 to 100, reflecting the legal practitioner's acumen and conduct. Scores below 50 indicate inadequate performance, while scores above 75 suggest exceptional advocacy."
      },
      reputationPoints: {
        description: "An integer from -10 to +10, reflecting ethical standing and professionalism. Points are deducted for misconduct and added for commendable behavior."
      },
      financialCompensation: {
        description: "The monetary amount specifically agreed upon as attorney fees in the settlement and during privileged conversations. Ensure to sum amounts from both contexts and convert values like '250k' to 250000. Very important, you sum up the financial compensation agreed by both sides. Example 1 : if with the opposing council, the user agrees 'pro bono' in " + settlement + ", but he agrees 50k in " + privilegedConvo + "you give 50k (pro bono = 0). Example 2 : if the user agrees with the opposing council for 2k attourney fees, and with his client 4k attourney fees, in the end - 6000 attourney fees"
      },
      behavioralAssessment: {
        description: "Evaluate " + practitionerRole + "'s demeanor and participation in legal proceedings. Assign a 'loss' status if the behavior was poor or non-participative."
      }
    },
    requiredResponseFormat: {
      score: "Integer score out of 100 reflecting overall performance.",
      verdict: "Summary of the agreements in the settlement.",
      reputationPoints: "Integer points assessing ethical and professional behavior.",
      compensation: "Integer representing the agreed-upon fees in the settlement or those discussed in privileged conversations.",
      status: practitionerRole + "'s case outcome ('won' or 'lost'). If the " + practitionerRole + "was able to get what his client wanted, consider it won.",
      justification: "Detailed reasoning behind the scores, compensation, and reputation points awarded, with specific references to behaviors and legal arguments during the proceedings."
    },
    notes: {
      evaluationDetail: "The assessment must meticulously evaluate all aspects of " + practitionerRole + "'s performance during depositions and hearings, adhering to the legal standards of the specified jurisdiction.",
      compensationClarification: "The financial compensation includes only the attorney fees as explicitly agreed in the settlement or during privileged conversations."
    }
  }, null, 2);
};


const opposingTeamTurn = (caseInfo, status, transcript, judge, name) => {
  // Determine the role to play based on the current status
  const roleToPlay = status === 'Prosecution' ? 'Defense' : 'Prosecution';
  
  // Generate a dynamic and complex prompt
  let prompt = `
  The courtroom is charged with tension as the ${status} team, led by ${name}, has just rested their case. You, playing the role of ${roleToPlay} attorney ${caseInfo.oppositionName}, are known for your sharp wit and unyielding pursuit of justice. With the gavel's echo still lingering, it's your turn to steer the fate of the case described as ${JSON.stringify(caseInfo)}.

  Judge ${judge.name}, a figure of stern demeanor and incisive legal acumen, turns their gaze upon you, expecting a performance that matches the gravity of the proceedings. The courtroom awaits, silent but for the shuffling of notes and the quiet breaths of its occupants.

  Your challenge is multifaceted:
  - Engage with witnesses through a series of calculated questions designed to unravel the narrative spun by the ${status}.
  - Present evidence with precision, painting a vivid picture that supports your argument, compelling the jury and satisfying the rigorous standards of Judge ${judge.name}.
  - Navigate objections, both raising and countering them, in a manner that demonstrates not only your legal expertise but also your strategic acumen.
  - Maintain a dialogue with Judge ${judge.name} that respects the court's protocols while advancing your case's interests.

  Each move you make, each word you utter, must be carefully considered, contributing to a seamless narrative that encapsulates your legal strategy and the complexities of the case.

  Craft your actions and exchanges in a JSON format that mirrors the flow of a real courtroom battle. This format not only demands precision but also encourages creativity within the structured confines of legal proceedings.

  Example JSON Response Format:
  [
    {
      "sender": "Name of the person speaking (e.g., ${caseInfo.oppositionName}, Witness Name, Judge ${judge.name})",
      "message": "What is delivered or asked."
    },
    {
      "sender": "The respondent or the next speaker",
      "message": "The reply, reaction, or the following inquiry."
    }
    // Continue adding objects to fully encapsulate the engagement of your turn.
  ]

  This simulation is your arena. Beyond merely responding, you're to weave a narrative that's both compelling and logically sound, reflecting the depth of your understanding and the breadth of your legal creativity. The weight of the ${roleToPlay} now rests on your shoulders.
  It must be complete, from the beginning to The announcement of resting of the ${roleToPlay}
  Remember: Your portrayal should not only adhere to the procedural and ethical standards expected in a court of law but also push the boundaries of legal strategy and courtroom dynamics. This is your chance to shine as a beacon of justice or a master of defense, shaping the outcome with each decision you make.
  `;

  // Return the dynamically constructed, enhanced prompt
  return prompt;
}




module.exports = {createDiscoveriesPrompt, conclusion, verdict, opposingTeamTurn, correspondingResponse, prosecutionFirstMessage, endSettlement, endDepositionTscrpt, SubpoenaMessagePrompt, createCasePrompt, issueSubpoenaPrompt, fileMotionPrompt}