let controller = require('../controllers/home.controller');

module.exports = (app)=>{
    app.get("/admission/api/Home", controller.home)
}