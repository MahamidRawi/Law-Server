const { formatDate } = require("../helper/res.helper");

const Err500 = 'An Error Occured';
const transactionMessageSuccess = (senderName, targetName, amount, reason, date) => {
    return `${senderName} has sent ${targetName} ${amount} $ for the following reason : ${reason} on ${formatDate(date)}`
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
        title: "Title of the Investigation Report",
        content: "Overview of the investigation's findings.",
        exactContent: "Detailed report including methodology, findings, and conclusions.",
        date: "Date of the report"
      }
    },
    {
      name: 'Administrative Subpoena',
      complexityFactor: 1.1,
      participant: false,
      template: {
        type: "Police Report",
        title: "Report Number and Incident Date",
        content: "Summary of the incident as reported to law enforcement.",
        exactContent: "Complete report text, including descriptions of the incident, statements from involved parties and witnesses, and initial findings.",
        date: "Date of the report"
      }
    },
    {
      name: 'Information Subpoena',
      complexityFactor: 1.2,
      participant: false,
      template: {
        type: "Email",
        title: "Subject of the Email",
        content: "Summary of the email's relevance to the case.",
        exactContent: "Complete email conversation, including sender, receiver, date, and body of the email.",
        date: "Date of the email"
      }
    },
    {
      name: 'Subpoena for Medical Records',
      complexityFactor: 1.7,
      participant: false,
      template: {
        type: "Medical Records",
        title: "Patient Name and Date of the Records",
        content: "Significance of the medical records to the individual's condition or the case.",
        exactContent: "Detailed account of medical visits, diagnoses, treatments, and physician notes, with relevance to case events highlighted.",
        date: "Date of the records"
      }
    },
    {
      name: 'Subpoena for Employment Records',
      complexityFactor: 1.3,
      participant: false,
      template: {
        type: "Employment Records",
        title: "Employee Name and Employment Period",
        content: "Summary of the employee's work history and its relevance to the case.",
        exactContent: "Detailed employment records including roles, durations, performance evaluations, and any incidents or disciplinary actions.",
        date: "Date of the employment records"
      }
    },
    {
      name: 'Subpoena for Bank Records',
      complexityFactor: 1.4,
      participant: false,
      template: {
        type: "Financial Records",
        title: "Bank Records of [Individual/Entity Name]",
        content: "Overview of the bank records' relevance to the case, highlighting financial transactions and balances.",
        exactContent: "Comprehensive listing of all transactions, deposits, withdrawals, and balances within the specified period, including any irregular activities or transactions that directly pertain to the case events. Each entry is annotated with explanations for its relevance to the ongoing investigation.",
        date: "Date of the bank records compilation"
      }
    },
    {
      name: 'Subpoena for School Records',
      complexityFactor: 1.1,
      participant: false,
      template: {
        type: "Academic Records",
        title: "[Name of the Institution and Student] Academic Records",
        content: "Overview of the academic records' relevance to the case.",
        exactContent: "Transcripts, diplomas, and other records, detailing courses, grades, and achievements, with any discrepancies or notable achievements highlighted.",
        date: "Date of the records"
      }
    },
    {
      name: 'Subpoena for Cellular Records',
      complexityFactor: 1.15,
      participant: false,
      template: {
        type: "Cellular Records",
        title: "[Subscriber Name and Period of Records]",
        content: "Summary of call logs, messages, and data usage relevant to the case.",
        exactContent: "[Detailed, not summarized, call records, message logs, and data usage reports, highlighting any communication pertinent to the case events.]",
        date: "Date of the cellular records"
      }
    },
    {
      name: 'Subpoena for Internet Records',
      complexityFactor: 1.25,
      participant: false,
      template: {
        type: "Internet Records",
        title: "[Account Holder's Name and Period of Records]",
        content: "[Overview of internet usage and activity relevant to the case.]",
        exactContent: "[Generate Detailed browsing history, email logs, social media activity, and any online transactions, with annotations explaining their relevance to the case.]",
        date: "Date of the internet records"
      }
    },
    {
      name: 'Subpoena for Family Tree Records',
      complexityFactor: 1.2,
      participant: false,
      template: {
        type: "Family Tree",
        title: "Family Tree of [Family Name]",
        content: "Overview of the family tree's relevance to the case, focusing on relationships and lineage.",
        exactContent: "[Detailed family tree chart, not summary, not a paragraph, including names, relationships, dates of birth, and any relevant annotations tying specific family members to case events.]",
        date: "Date of the family tree compilation"
      }
    },
    {
      name: 'Subpoena for Security Footage',
      complexityFactor: 1.5,
      participant: false,
      template: {
        type: "Surveillance Footage",
        title: "[Location and Date of the Footage]",
        content: "Description of the footage's relevance to the case events, focusing on specific time frames.",
        exactContent: "[Timestamped summary of the footage, noting key moments and individuals captured, supplemented by still images or descriptions of significant actions or events.]",
        date: "Date of the recording"
      }
    }

];

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


module.exports = {lMPrices, typesOfSubpoenas, calculatedPrices, Err500, transactionMessageSuccess, fieldsOfLaw, lawSystems}
