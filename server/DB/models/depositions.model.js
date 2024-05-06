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
  attourney: {
    type: Boolean,
    default: false
  },
  privileged: {
    type: Boolean,
    default: false
  },
  messageHistory: [
    {
      sender: String,
      message: String,
    }
  ]

});

mongoose.model('Chat', DepositionSchema);