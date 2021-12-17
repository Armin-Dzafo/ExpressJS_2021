const express = require('express')
const router = express.Router()

const {    
    getPeople,
    createPerson,
    createPersonPostman,
    updatePerson,
    deletePerson
} = require('../controllers/people')

// router.get('/', getPeople)
// router.post('/', createPerson)
// router.post('/postman', createPersonPostman)
// // method for modifying data
// router.put('/:id', updatePerson)  
// // delete method
// router.delete('/:id', deletePerson)

// alternatively
router.route('/').get(getPeople).post(createPersonPostman);
router.route('/postman').post(createPersonPostman);
router.route(':id').put(updatePerson).delete(deletePerson)
  
module.exports = router