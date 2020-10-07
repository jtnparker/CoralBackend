const controller = require('./controller');
const router = require('express').Router();

router
  .route('/api/values')
    .get(controller.getAll)
    .post(controller.postValues)

    router
    .route('/api/values/:id')  
    .delete(controller.deleteBrand)
module.exports = router;