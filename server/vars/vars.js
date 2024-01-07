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


module.exports = {Err500, transactionMessageSuccess, fieldsOfLaw, lawSystems}
