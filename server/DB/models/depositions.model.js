const mongoose = require('mongoose');

const DepositionSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  subpoenee: {
    name: String,
    role: String
  },
  messageHistory: [
    {
      sender: String,
      message: String,
    }
  ]

});

mongoose.model('Deposition', DepositionSchema);