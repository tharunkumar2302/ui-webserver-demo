const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const addAuditFields = require('../utils/addAuditFields');
const { pricingplanusageorganisation,pricingplan, pricingPlanRules } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * @swagger
 * /pricingPlan:
 *   get:
 *     summary: Get pricing plans data
 *     description: Admin,recruiter,employer can retrieve pricing plans data.
 *     tags: [Pricing Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/pricingplan'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

const getPricingPlanData = catchAsync(async (req, res) => {
    const pricingPlan = await pricingplan.findById(req.user.pricingPlan);
    const planDetails = await pricingplanusageorganisation.findOne({name: pricingPlan.name,organization: req.user.organization});
    if(planDetails == null){
      throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No!!');
    } else {
      for(let element of planDetails.rules){
        console.log(element);
        element.remaining = element.value - element.actual;
        console.log(element);
      }
    res.send({result: planDetails.rules})
    }
});

/**
 * @swagger
 * /pricingPlan/plans:
 *   get:
 *     summary: Get pricing plans
 *     description: Only Admin can retrieve pricing plans.
 *     tags: [Pricing Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/pricingplan'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

const getPricingPlans = catchAsync(async(req,res) => {
  pricingplan.find({},(err,data)=>{
    res.send({results: data})
  })
})

module.exports = { getPricingPlanData,getPricingPlans };
