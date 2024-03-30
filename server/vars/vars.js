const { formatDate } = require("../helper/res.helper");

const Err500 = 'An Error Occured';
const transactionMessageSuccess = (senderName, targetName, amount, reason, date) => {
    return `${senderName} has sent ${targetName} ${Number(amount).toLocaleString()} $ for the Following Reason : ${reason}, On : ${formatDate(date)}`
};

const fieldsOfLaw = [
    'Administrative Law',
    'Admiralty and Maritime Law',
    'Antitrust and Trade Regulation',
    'Appellate Practice',
    'Aviation and Aerospace',
    'Banking Law',
    'Bankruptcy',
    'Business Law',
    'Civil Rights',
    'Commercial Law',
    'Communications Law',
    'Constitutional Law',
    'Construction Law',
    'Contracts',
    'Corporate Law',
    'Criminal Law',
    'Education Law',
    'Elder Law',
    'Election, Campaign and Political Law',
    'Employee Benefits',
    'Energy Law',
    'Entertainment and Sports Law',
    'Environmental Law',
    'Family Law',
    'Finance',
    'Government Contracts',
    'Health Care Law',
    'Immigration Law',
    'Insurance Law',
    'Intellectual Property',
    'International Law',
    'Labor and Employment',
    'Litigation',
    'Mergers and Acquisitions',
    'Military Law',
    'Natural Resources Law',
    'Personal Injury',
    'Product Liability',
    'Professional Liability',
    'Real Estate',
    'Securities Law',
    'Tax Law',
    'Technology and Science',
    'Torts',
    'Transportation Law',
    'Trusts and Estates',
    'Workers\' Compensation',
    'Zoning, Planning and Land Use'
  ];

  const baseCost = 80;
  const lMBaseCost = 100;

  const typesOfSubpoenas = [
    { name: 'Subpoena ad testificandum', complexityFactor: 1, participant: true },
    { name: 'Deposition Subpoena', complexityFactor: 1.2, participant: true },
    { name: 'Subpoena for Personal Appearance', complexityFactor: 1.3, participant: true },
    { name: 'Subpoena for Trial', complexityFactor: 1.6, participant: true },
    { name: 'Subpoena for Hearing', complexityFactor: 1, participant: true },
    { name: 'Subpoena for Arbitration', complexityFactor: 1.5, participant: true },
      {
        name: 'Subpoena to Produce Documents or Permit Inspection',
        complexityFactor: 1.4,
        participant: false,
        template: {
          type: "Investigation Report",
          title: "{{Title of the Investigation Report}}",
          content: "Overview of the investigation's findings.",
          exactContent: "Report Title: '{{Report Title}}'\nDate: '{{YYYY-MM-DD}}'\n\nMethodology:\n{{Investigation techniques and tools used.}}\n\nFindings:\n{{Detailed account of evidence found, including photographs, diagrams, and key observations.}}\n\nConclusions:\n{{Implications for the case.}}\n\nRecommendations:\n{{Suggested next steps.}}",
          date: "{{Date of the report}}"
        }
      },
      {
        name: 'Administrative Subpoena',
        complexityFactor: 1.1,
        participant: false,
        template: {
          type: "Police Report",
          title: "{{Report Number and Incident Date}}",
          content: "Summary of the incident as reported to law enforcement.",
          exactContent: "Report Number: '{{Report Number}}'\nIncident Date: '{{YYYY-MM-DD}}'\n\nIncident Description:\n{{Detailed narrative of the event, including involved parties and witness statements.}}\n\nFindings:\n{{Initial observations and evidence collected.}}\n\nPhotos/Diagrams:\n{{Descriptions of included visual aids.}}",
          date: "{{Date of the report}}"
        }
      },
      {
        name: 'Information Subpoena',
        complexityFactor: 1.2,
        participant: false,
        template: {
          type: "Email",
          title: "{{Subject of the Email}}",
          content: "Summary of the email's relevance to the case.",
          exactContent: "Date: '{{YYYY-MM-DD}}'\nFrom: '{{Sender}}'\nTo: '{{Receiver}}'\nSubject: '{{Subject Line}}'\n\nBody:\n{{Full email body text}}\n\nFollow-up:\n{{Response emails with full headers and body.}}",
          date: "{{Date of the email}}"
        }
      },
      {
        name: 'Subpoena for Medical Records',
        complexityFactor: 1.7,
        participant: false,
        template: {
          type: "Medical Records",
          title: "{{Patient Name and Date of the Records}}",
          content: "Significance of the medical records to the individual's condition or the case.",
          exactContent: "Patient: '{{Patient Name}}'\nRecord Date: '{{YYYY-MM-DD}}'\n\nVisits:\n{{Date and summary of each visit, diagnosis, treatments, and physician notes.}}\n\nSummary:\n{{Relevance of medical history to the case.}}",
          date: "{{Date of the records}}"
        }
      },
      {
        name: 'Subpoena for Employment Records',
        complexityFactor: 1.3,
        participant: false,
        template: {
          type: "Employment Records",
          title: "{{Employee Name and Employment Period}}",
          content: "Summary of the employee's work history and its relevance to the case.",
          exactContent: "Employee: '{{Employee Name}}'\nPeriod: '{{Employment Period}}'\n\nEmployment History:\n{{Roles, durations, performance evaluations, incidents, or disciplinary actions.}}\n\nSummary:\n{{Implications for the case.}}",
          date: "{{Date of the employment records}}"
        }
      },
      {
        name: 'Subpoena for Bank Records',
        complexityFactor: 1.4,
        participant: false,
        template: {
          type: "Financial Records",
          title: "Bank Records of {{Individual/Entity Name}}",
          content: "Overview of the bank records' relevance to the case, highlighting financial transactions and balances.",
          exactContent: "Account Holder: '{{Individual/Entity Name}}'\nPeriod: '{{Specified Period}}'\n\nTransactions:\n{{List of transactions, including dates, descriptions, amounts, and balances. Annotations for each transaction's relevance to the investigation.}}",
          date: "{{Date of the bank records compilation}}"
        }
      },
      {
        name: 'Subpoena for School Records',
        complexityFactor: 1.1,
        participant: false,
        template: {
          type: "Academic Records",
          title: "{{Name of the Institution and Student}} Academic Records",
          content: "Overview of the academic records' relevance to the case.",
          exactContent: "Student: '{{Student Name}}'\nInstitution: '{{Institution Name}}'\n\nAcademic History:\n{{Transcripts, grades, and achievements with discrepancies or notable achievements highlighted.}}",
          date: "{{Date of the records}}"
        }
      },
      {
        name: 'Subpoena for Cellular Records',
        complexityFactor: 1.15,
        participant: false,
        template: {
          type: "Cellular Records",
          title: "{{Subscriber Name and Period of Records}}",
          content: "Summary of call logs, messages, and data usage relevant to the case.",
          exactContent: "Subscriber: '{{Subscriber Name}}'\nPeriod: '{{Period of Records}}'\n\nCellular Activity:\n{{Call records, message logs, and data usage reports, with communications pertinent to the case highlighted.}}",
          date: "{{Date of the cellular records}}"
        }
      },
      {
        name: 'Subpoena for Internet Records',
        complexityFactor: 1.25,
        participant: false,
        template: {
          type: "Internet Records",
          title: "{{Account Holder's Name and Period of Records}}",
          content: "Overview of internet usage and activity relevant to the case.",
          exactContent: "Account Holder: '{{Account Holder's Name}}'\nPeriod: '{{Period of Records}}'\n\nOnline Activity:\n{{Detailed browsing history, email logs, social media activity, and online transactions, with relevance to the case annotated.}}",
          date: "{{Date of the internet records}}"
        }
      },
      {
        name: 'Subpoena for Family Tree Records',
        complexityFactor: 1.2,
        participant: false,
        template: {
          type: "Family Tree",
          title: "Family Tree of {{Family Name}}",
          content: "Overview of the family tree's relevance to the case, focusing on relationships and lineage.",
          exactContent: "Family Name: '{{Family Name}}'\n\nFamily Tree:\n{{Detailed chart including names, relationships, dates of birth, and annotations tying family members to case events.}}",
          date: "{{Date of the family tree compilation}}"
        }
      },
      {
        name: 'Subpoena for Security Footage',
        complexityFactor: 1.5,
        participant: false,
        template: {
          type: "Surveillance Footage",
          title: "{{Location and Date of the Footage}}",
          content: "Description of the footage's relevance to the case events, focusing on specific time frames.",
          exactContent: `
      Location: '{{Location}}'
      Date: '{{Date of the Footage}}'
      
      Footage Overview:
      - Start Time: '{{Start Time}}'
      - End Time: '{{End Time}}'
      - Total Duration: '{{Total Duration of Footage}}'
      
      Key Moments:
          timestamps like the following : 
            Timestamp: '{{Timestamp n}}'
            Description: '{{Detailed description of the event at Timestamp n, including observed individuals and their actions.}}'
            Relevance: '{{Explanation of how this moment is relevant to the case.}}'
      
      Additional Events:
      {{Further detailed descriptions of other significant moments within the footage, each with a timestamp, description, and relevance to the investigation.}}
      
      Summary:
      - A concise summary highlighting the critical insights gathered from the surveillance footage and their implications for the case.
      
      Notes:
      - Specific observations by the reviewer, potential areas for further review, or discrepancies noted between reported events and what is observed in the footage.`,
          date: "{{Date of the recording}}"
        }
      }
    ]

const legalMotions = [
  { name: "Motion to Dismiss", complexityFactor: 2, description: "Seeks to have the case thrown out before trial." },
  { name: "Motion for Summary Judgment", complexityFactor: 3, description: "Requests a judgment based on facts without a trial." },
  { name: "Motion in Limine", complexityFactor: 2.5, description: "Aims to limit or prevent certain evidence from being presented at trial." },
  { name: "Motion to Strike", complexityFactor: 2, description: "Seeks to remove parts of the pleading or evidence." },
  { name: "Motion for Continuance", complexityFactor: 1.5, description: "Requests a delay or rescheduling of the court proceeding." }
];

const lMPrices = legalMotions.map(motion => ({
  name: motion.name,
  price: motion.complexityFactor * lMBaseCost,
  description: motion.description
}));


  const calculatedPrices = typesOfSubpoenas.map(subpoena => ({
    participant: subpoena.participant,
    name: subpoena.name,
    template: subpoena.template,
    price: baseCost * subpoena.complexityFactor
}));

  const lawSystems = [
    "Common Law (USA)",
    "Civil Law (France)",
    "Islamic Law (Sharia)",
    "Roman Law (Ancient Rome)",
    "Napoleonic Code (France)",
    "Germanic Law (Germany)",
    "Customary Law (Various Countries)",
    "Talmudic Law (Jewish Law)",
    "Hindu Law (India)",
    "Chinese Legal Tradition (China)",
    "Japanese Legal Tradition (Japan)",
    "Commonwealth Law (UK and Former British Colonies)",
    "Scandinavian Legal Tradition (Nordic Countries)",
    "Soviet Law (Former Soviet Union)",
    "International Law (Global)",
    "Indigenous Legal Systems (Various Indigenous Peoples)",
  ];

  const discoveryTemplates = [
    {
      "type": "Document",
      "title": "Explicit Title Reflecting Document Subject",
      "content": "Concise summary highlighting the document's relevance to the case.",
      "exactContent": "Title: '{{Document Title}}'\nDate: '{{YYYY-MM-DD}}'\n\nOverview:\n{{Brief overview of document relevance and content.}}\n\nDetailed Analysis:\n{{Point-by-point detailed analysis, including data points, names, dates, and locations.}}\n\nImplications:\n{{Discussion on how this document affects the case.}}\n\nAttachments:\n{{List of attached images, charts, or relevant documents with brief descriptions.}}",
      "date": "YYYY-MM-DD format"
    },
    {
      "type": "Testimony",
      "title": "Witness Name or Identifier",
      "content": "Essential summary of the testimony, emphasizing its impact on the case.",
      "exactContent": "Witness: '{{Name}}'\nDate: '{{YYYY-MM-DD}}'\n\nTranscript:\nQ1: '{{Question 1}}'\nA1: '{{Answer 1}}'\nQ2: '{{Question 2}}'\nA2: '{{Answer 2}}'\n{{Additional Q&A as necessary}}\n\nConclusion:\n{{Key takeaways from the testimony.}}\n\nNotes:\n{{Examiner's observations or relevant comments.}}",
      "date": "YYYY-MM-DD format"
    },
    {
      "type": "Investigation Report",
      "title": "Investigation Focus and Report Number",
      "content": "Overview summarizing key findings and their implications.",
      "exactContent": "Report Title: '{{Report Title}}'\nDate: '{{YYYY-MM-DD}}'\n\nMethodology:\n{{Description of investigation techniques and tools used.}}\n\nFindings:\n{{Detailed account of evidence found, including photographs, diagrams, and key observations.}}\n\nConclusions:\n{{Summary of implications for the case.}}\n\nRecommendations:\n{{Suggested next steps based on findings.}}",
      "date": "YYYY-MM-DD format"
    },
    // Following the same pattern for other document types
    {
      "type": "Email",
      "title": "Email Subject Line",
      "content": "Summary of the email's relevance to the case.",
      "exactContent": "Date: '{{YYYY-MM-DD}}'\nFrom: '{{Sender}}'\nTo: '{{Receiver}}'\nSubject: '{{Subject Line}}'\n\nBody:\n{{Full email body text}}\n\nFollow-up:\n{{Response emails if any, with full headers and body.}}\n\nSummary:\n{{Key points and relevance to the case.}}",
      "date": "YYYY-MM-DD format"
    },
    {
      "type": "Financial Records",
      "title": "Record Type and Account Number",
      "content": "Analysis of the record's significance, focusing on financial implications.",
      "exactContent": "Account Number: '{{Account Number}}'\nStatement Period: '{{Start Date}} to {{End Date}}'\n\nTransactions:\n- Date: '{{Transaction Date}}', Description: '{{Transaction Description}}', Amount: '{{Amount}}', Balance: '{{Running Balance}}'\n{{Repeat for each transaction}}\n\nSummary:\n{{Analysis of financial activity's impact on the case.}}",
      "date": "YYYY-MM-DD format"
    },{
        "type": "Surveillance Footage",
        "title": "Location and Timestamp of Footage",
        "content": "Contextual overview of the footage's role in the investigation.",
        "exactContent": "Location: '{{Location}}'\nDate and Time: '{{YYYY-MM-DD HH:MM}}'\n\nEvents:\n{{Timestamped summary of key moments and individuals identified, with detailed descriptions of actions.}}\n\nAnalysis:\n{{Significance of footage to case investigation, including any discrepancies or notable behaviors observed.}}",
        "date": "YYYY-MM-DD format"
      },
      {
        "type": "Medical Records",
        "title": "Patient Name and Record Number",
        "content": "Summary of medical history's relevance to case events.",
        "exactContent": "Patient: '{{Patient Name}}'\nRecord Date: '{{YYYY-MM-DD}}'\n\nVisits:\n{{Date and summary of each visit, including diagnosis, treatment provided, and physician notes.}}\n\nSummary:\n{{Medical history overview with relevance to the case highlighted, including any discrepancies or notable conditions.}}",
        "date": "YYYY-MM-DD format"
      },
      {
        "type": "Police Report",
        "title": "Incident Report Number",
        "content": "Brief overview of the incident and initial findings.",
        "exactContent": "Report Number: '{{Report Number}}'\nIncident Date: '{{YYYY-MM-DD}}'\n\nIncident Description:\n{{Detailed narrative of the event, including involved parties, witness statements, and initial findings.}}\n\nFindings:\n{{Initial observations, evidence collected, and any immediate conclusions drawn.}}\n\nPhotos/Diagrams:\n{{Descriptions of included visual aids, if any, with relevance to the findings.}}",
        "date": "YYYY-MM-DD format"
      },
      {
        "type": "Court Document",
        "title": "Document Name and Case Number",
        "content": "Outline of the document's legal significance.",
        "exactContent": "Document Title: '{{Title}}'\nCase Number: '{{Case Number}}'\n\nLegal Text:\n{{Full document content, with critical sections highlighted and annotated for clarity.}}\n\nAnalysis:\n{{Commentary on document implications for the case, including any legal precedents or arguments presented.}}\n\nAttachments:\n{{Any relevant legal briefs, exhibits, or supporting documents listed with brief descriptions.}}",
        "date": "YYYY-MM-DD format"
      },
      {
        "type": "Contract Agreement",
        "title": "Contract Title and Parties Involved",
        "content": "Summary of the contract's purpose and its relevance to the dispute.",
        "exactContent": "Contract Title: '{{Title}}'\nParties Involved: '{{Names of Parties}}'\nDate: '{{YYYY-MM-DD}}'\n\nTerms:\n{{Detailed enumeration of contract terms, conditions, and obligations, with key clauses highlighted and their implications discussed.}}\n\nSignatures:\n{{Signatures of all parties involved, with dates.}}\n\nAnalysis:\n{{Examination of the contract's relevance to the dispute, including any points of contention.}}",
        "date": "YYYY-MM-DD format"
      },
      {
        "type": "Academic Records",
        "title": "Institution Name and Student Identifier",
        "content": "Insight into the records' pertinence to the investigation.",
        "exactContent": "Student: '{{Student Name}}'\nInstitution: '{{Institution Name}}'\nDate: '{{YYYY-MM-DD}}'\n\nRecords:\n{{Detailed list of courses, grades, and academic achievements, with any discrepancies or notable achievements highlighted.}}\n\nSummary:\n{{Overview of academic performance with emphasis on relevance to the case, including any patterns or irregularities observed.}}",
        "date": "YYYY-MM-DD format"
      }
    ];

    const judges = [
      { name: "Judge Anderson", reputation: "Fair and patient", difficulty: "easy" },
      { name: "Judge Bennett", reputation: "Quick and decisive", difficulty: "medium" },
      { name: "Judge Carter", reputation: "Thorough and detailed", difficulty: "hard" },
      { name: "Judge Daniels", reputation: "Innovative and strategic", difficulty: "extreme" },
      { name: "Judge Evans", reputation: "Empathetic and understanding", difficulty: "easy" },
      { name: "Judge Fisher", reputation: "Rigorous and stern", difficulty: "medium" },
      { name: "Judge Green", reputation: "Adaptable and insightful", difficulty: "hard" },
      { name: "Judge Harris", reputation: "Precise and meticulous", difficulty: "extreme" },
      { name: "Judge Ingram", reputation: "Dynamic and persuasive", difficulty: "easy" },
      { name: "Judge Jenkins", reputation: "Resolute and fearless", difficulty: "medium" },
      { name: "Judge Knight", reputation: "Compassionate and fair", difficulty: "hard" },
      { name: "Judge Lloyd", reputation: "Efficient and practical", difficulty: "extreme" },
      { name: "Judge Morris", reputation: "Probing and analytical", difficulty: "easy" },
      { name: "Judge Nelson", reputation: "Inquisitive and thoughtful", difficulty: "medium" },
      { name: "Judge Owens", reputation: "Bold and authoritative", difficulty: "hard" },
      { name: "Judge Patel", reputation: "Direct and uncompromising", difficulty: "extreme" },
      { name: "Judge Quinn", reputation: "Sympathetic and lenient", difficulty: "easy" },
      { name: "Judge Rivera", reputation: "Disciplined and structured", difficulty: "medium" },
      { name: "Judge Stewart", reputation: "Creative and adaptive", difficulty: "hard" },
      { name: "Judge Turner", reputation: "Astute and sharp", difficulty: "extreme" },
      { name: "Judge Underwood", reputation: "Generous and kind", difficulty: "easy" },
      { name: "Judge Vaughn", reputation: "Stern and challenging", difficulty: "medium" },
      { name: "Judge Wallace", reputation: "Exacting and firm", difficulty: "hard" },
      { name: "Judge Xander", reputation: "Innovative and boundary-pushing", difficulty: "extreme" },
      { name: "Judge Young", reputation: "Energetic and passionate", difficulty: "easy" }
    ];


module.exports = { judges, discoveryTemplates, lMPrices, typesOfSubpoenas, calculatedPrices, Err500, transactionMessageSuccess, fieldsOfLaw, lawSystems}
