const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');


const PricingPlanRulesSchema = mongoose.Schema({
    description: {
        type: String,
        trim: true,
    },
    rule_Code: {
        type: String,
        trim: true,
    },
    rule_Type: {
        type: String,
        trim: true,
    },
    value: {
        type: Number,
        trim: true,
    },
    actual: {
        type: Number,
        trim: true,
    },
    remaining: {
        type: Number,
        trim: true,
    },
    plan: {
        type: String,
        trim: true,
    }
})
// add plugin that converts mongoose to json
PricingPlanRulesSchema.plugin(toJSON);
PricingPlanRulesSchema.plugin(paginate);

/**
 * @typedef PricingPlanUsageOrganization
 */
const pricingPlanRules = mongoose.model('pricingplanrules', PricingPlanRulesSchema);

module.exports = pricingPlanRules;