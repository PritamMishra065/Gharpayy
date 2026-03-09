import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  property: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'pending' },
  notes: { type: String },
}, { timestamps: true });

visitSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
visitSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Visit || mongoose.model('Visit', visitSchema);
