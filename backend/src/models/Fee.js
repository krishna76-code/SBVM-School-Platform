import mongoose from 'mongoose';

const FeeSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'StudentProfile', 
    required: true 
  },
  term: { 
    type: String, 
    enum: ['Quarterly', 'Half-Yearly', 'Annual'], 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  concession: { 
    type: Number, 
    default: 0 
  },
  finalAmount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Unpaid', 'Paid', 'Pending'], 
    default: 'Unpaid' 
  },
  paymentMethod: { 
    type: String 
  },
  paymentDate: { 
    type: Date 
  },
  transactionId: { 
    type: String 
  }
}, { timestamps: true });

// Pre-save hook to automatically compute final amount based on concession waiver
FeeSchema.pre('save', function(next) {
  this.finalAmount = Math.round(this.amount * (1 - (this.concession / 100)));
  next();
});

const Fee = mongoose.model('Fee', FeeSchema);
export default Fee;
