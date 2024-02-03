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

  const typesOfSubpoenas = [
    { name: 'Subpoena ad testificandum', complexityFactor: 1, participant: true },
    { name: 'Subpoena duces tecum', complexityFactor: 1.5, participant: false },
    { name: 'Deposition Subpoena', complexityFactor: 1.2, participant: true },
    { name: 'Subpoena to Produce Documents or Permit Inspection', complexityFactor: 1.4, participant: false },
    { name: 'Administrative Subpoena', complexityFactor: 1.1, participant: false },
    { name: 'Subpoena for Personal Appearance', complexityFactor: 1.3, participant: true },
    { name: 'Subpoena for Trial', complexityFactor: 1.6, participant: true },
    { name: 'Subpoena for Hearing', complexityFactor: 1, participant: true },
    { name: 'Subpoena for Arbitration', complexityFactor: 1.5, participant: true },
    { name: 'Information Subpoena', complexityFactor: 1.2, participant: false },
    { name: 'Subpoena for Medical Records', complexityFactor: 1.7, participant: false },
    { name: 'Subpoena for Employment Records', complexityFactor: 1.3, participant: false },
    { name: 'Subpoena for Bank Records', complexityFactor: 1.4, participant: false },
    { name: 'Subpoena for School Records', complexityFactor: 1.1, participant: false },
    { name: 'Subpoena for Cellular Records', complexityFactor: 1.15, participant: false },
    { name: 'Subpoena for Internet Records', complexityFactor: 1.25, participant: false }
];


  const calculatedPrices = typesOfSubpoenas.map(subpoena => ({
    participant: subpoena.participant,
    name: subpoena.name,
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


module.exports = {calculatedPrices, Err500, transactionMessageSuccess, fieldsOfLaw, lawSystems}
