const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');


const PricingPlanUsageOrganizationSchema = mongoose.Schema({
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    uique_Code: {
        type: String,
        trim: true,
    },
    rules: {
        type: Array,
        trim: true,
    }
})
// add plugin that converts mongoose to json
PricingPlanUsageOrganizationSchema.plugin(toJSON);
PricingPlanUsageOrganizationSchema.plugin(paginate);
/**
 * @typedef PricingPlanUsageOrganization
 */
const pricingplanusageorganisation = mongoose.model('pricingplanusageorganisation', PricingPlanUsageOrganizationSchema);

module.exports = pricingplanusageorganisation;