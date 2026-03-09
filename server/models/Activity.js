import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  type: { type: String, required: true },
  content: { type: String },
  actor: { type: String, default: 'System' },
}, { timestamps: true });

activitySchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Front end compatibility alias
activitySchema.virtual('timestamp').get(function() {
  return this.createdAt;
});

activitySchema.set('toJSON', { virtuals: true });

export default mongoose.models.Activity || mongoose.model('Activity', activitySchema);
