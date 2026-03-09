import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  stage: { type: String, default: 'new' },
  source: { type: String },
  budget: { type: String },
  location: { type: String },
  assignedTo: { type: String },
  score: { type: Number, default: 0 },
  isNewLead: { type: Boolean, default: true },
  lastActivity: { type: Date, default: Date.now },
}, { timestamps: true });

// Virtual to duplicate _id as id for frontend compatibility
leadSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
leadSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
