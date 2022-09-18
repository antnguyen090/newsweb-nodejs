const util  = require('util');
const notify= require(__path_configs + 'notify');
const { body, validationResult } = require('express-validator');

const options = {
    name: { min: 5, max: 300 },
    ordering: { min: 0, max: 100 },
    status: { value: 'novalue' },
    special: { value: 'novalue' },
    content: { min: 5, max: 20000 },
}

module.exports = {
   
    validator: async (req) => {
        //  body('ordering').isInt({min: 0, max: 99}).withMessage('Ordering must be number from 0 to 99').custom(async (req) => {
        //         let errors = await validationResult(req)
        //         console.log(errors)
        //         return errors;
        //     })
       // STATUS
    }
}