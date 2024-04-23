const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');


const PricingPlanSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    unique_Code: {
        type: String,
        trim: true,
    },
})
// add plugin that converts mongoose to json
PricingPlanSchema.plugin(toJSON);
PricingPlanSchema.plugin(paginate);
/**
 * @typedef PricingPlanUsageOrganization
 */
const pricingplan = mongoose.model('pricingplan', PricingPlanSchema);

module.exports = pricingplan;