/**
 * @cons
 */
const express = require("express");
/**
 * @cons
 */
const path = require("path");
/**
 * @cons
 */
const Event = require("./models/Event");
const exp = require("constants");
const Category = require("./models/Category");

/**
 * @cons
 */
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

/**
 * @cons
 */
const VIEW_PATH = path.join(__dirname, "/views/");
/**
 * @cons
 */
const PORT_NUMBER = 8080;
/**
 * @cons
 */
const app = express();



/**
 * @array
 */
let eventDatabase = []
/**
 * @array
 */
let categoryDatabase = []


app.set("port", 8080);
/**
 * set up static file paths
 */
app.use(express.static(VIEW_PATH))

app.use("/ziyang", express.static(VIEW_PATH))
app.use("/ziyang/event_list", express.static("img"))
app.use("/ziyang/sold_out_event_list", express.static("img"))
app.use("/ziyang/add_event", express.static("node_modules/bootstrap/dist/css"))
app.use("/ziyang/sold_out_event_list", express.static("node_modules/bootstrap/dist/css"))
app.use("/ziyang/event_list", express.static("node_modules/bootstrap/dist/css"))
app.use("/ziyang/delete_event_by_id", express.static("node_modules/bootstrap/dist/css"))
app.use("/ziyang/category_detail/", express.static("node_modules/bootstrap/dist/css"))

app.use(express.static("node_modules/bootstrap/dist/css"));
app.use(express.static(__dirname + "/img/"))
app.use(express.static("out"))
app.use(express.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use("/29709229", express.static(VIEW_PATH))
app.use("/29709229/add_category", express.static("node_modules/bootstrap/dist/css"))
app.use("/29709229/category_list", express.static("img"))
app.use("/29709229/category_list", express.static("node_modules/bootstrap/dist/css"))
app.use("/ziyang/event_details", express.static("node_modules/bootstrap/dist/css"))
app.use("/29709229/delete_category_by_id", express.static("node_modules/bootstrap/dist/css"))
app.use("/29709229/event_details/", express.static("img"))

/**
 * generate random event ID
 * @returns {string} event id
 */
function eventIdGenerator() {
    
    let randomAlphabet = ""
    for (let i=0; i < 2; i++) {
        randomAlphabet = randomAlphabet + characters.charAt(Math.floor(Math.random()*characters.length))
    }

    let id = "E" + randomAlphabet + "-" + parseInt(Math.random()*10000)
    return id
}

/**
 * generate random category ID
 * @returns {string} category id
 */
function categoryIdGenerator() {
    
    let randomAlphabet = ""
    for (let i=0; i < 2; i++) {
        randomAlphabet = randomAlphabet + characters.charAt(Math.floor(Math.random()*characters.length))
    }

    let id = "C" + randomAlphabet + "-" + parseInt(Math.random()*10000)
    return id
}



/**
 * make server to listen to port number
 * @function
 * @param {number} port_number
 * @param {Function} callback
 */
app.listen(app.get("port"), ()=>console.log(`listening to port ${PORT_NUMBER}`))




/**
 * serve documentation
 * @name get/documentation
 * @function
 * @param {string} path
 * @param {Function} callback
 */
app.get("/documentation", function(req, res) {
    res.sendFile(__dirname + "/out/global.html")
})

/**
 * serve the site home page ('index.html')
 * @name get/
 * @function
 * @param {string} path
 * @param {Function} callback
 */
app.get("/", function(req, res) {
    res.sendFile("index.html")
})

/**
 * serve the add_event.html
 * @name get/ziyang/add_event
 * @function
 * @param {string} path
 * @param {Function} callback
 */
app.get("/ziyang/add_event", function(req, res) {
    res.render(VIEW_PATH + "add_event.html")
})

/**
 * parse the entered event information from the form in add_event.html and create a Event object, then add to the event database
 * @name get/ziyang/add_event/submit
 * @function
 * @param {string} path
 * @param {Function} callback
 */
app.post("/ziyang/add_event/submit", function(req, res) {
    // create new event object
    let newEvent = new Event(eventIdGenerator(), req.body.event_name, req.body.description, req.body.start_date_time, req.body.duration
                                               , req.body.status, req.body.image_path, req.body.capacity
                                               , req.body.tickets_available, req.body.category_id)
    
    // check if client input image path or not, if no, use default image path
    if (!newEvent.imagePath) {
        newEvent.imagePath = "default_event_img.jpg"
    }

    // update database
    eventDatabase.push(newEvent)
    res.redirect("/ziyang/event_list")
})

/**
 * serve the Event List page and render all events in database
 * @name get/ziyang/event_list
 * @function
 * @param {string} path
 * @param {Function} callback
 */
app.get("/ziyang/event_list", function(req, res) {
    res.render("event_list.html", {events: eventDatabase})
})

/**
 * serve the Sold Out Event List page and render it
 * @name get/ziyang/sold_out_event_list
 * @function
 * @param {string} path
 * @param {Function} callback
 */
app.get("/ziyang/sold_out_event_list", function(req, res) {
    let soldOutEvent = []

    // get all events that has 0 available tickets
    for (let i = 0; i < eventDatabase.length; i++) {
        if (eventDatabase[i].ticketsAvailable == 0) {
            soldOutEvent.push(eventDatabase[i])
        }
    }
    res.render("event_list.html", {events: soldOutEvent})
})

/**
 * serve category detail page, with event list of the category
 * @name get/ziyang/category_detail/:category_id
 * @function
 * @param {string} path
 * @param {Function} callback
 */

app.get("/ziyang/category_detail/:category_id", function(req, res) {
    let categoryToRender = null
    let categoryIdToFind = req.params.category_id
    let eventList = []

    // find the category that match the category id in the request parameter
    for (let i = 0 ; i < categoryDatabase.length ; i ++) { 
        if (categoryDatabase[i].id === categoryIdToFind) {
            categoryToRender = categoryDatabase[i]
        }
    }

    // get all events that is in the category
    for (let i = 0 ; i < eventDatabase.length ; i ++) { 
        if (eventDatabase[i].categoryId === categoryIdToFind) {
            eventList.push(eventDatabase[i])
        }
    }

    res.render("category_details.html", {category: categoryToRender, events: eventList})
}) 

/**
 * serve a html page to let user enter the id of the event to be deleted
 * @name get/ziyang/delete_event_by_id
 * @function
 * @param {string} path
 * @param {Function} callback
 */
app.get("/ziyang/delete_event_by_id", function(req, res) {
    res.render("delete_event.html")
})

/**
 * delete the event with the id entered by client and update the database
 * @name get/ziyang/delete_event_by_id
 * @function
 * @param {string} path
 * @param {Function} callback
 */
app.post("/ziyang/delete_event_by_id/submit", function(req, res) {
    for (let i = 0; i < eventDatabase.length; i++) {
        if (eventDatabase[i].id == req.body.event_id) {
            eventDatabase.splice(i, 1)
        }
    }
    res.redirect("/ziyang/event_list")
})

/**
 * -------------- CATEGORY CODE BEGINS ----------------------- *
 */

/**
 * serve the Add Category html page
 * @name get/29709229/add_category
 * @function
 * @param {string} path
 * @param {Function} callback
 */
app.get("/29709229/add_category", function(req, res) {
    res.render(VIEW_PATH + "add_category.html")
})

/**
 * submit the Category information loaded from the Add Category page
 * @name get/29709229/add_category/submit
 * @function
 * @param {string} path
 * @param {Function} callback
 */
app.post("/29709229/add_category/submit", function(req, res) {
    let date = new Date()
    let newCategory = new Category(categoryIdGenerator(), req.body.category_name, req.body.description, req.body.image_path, date)
    if (!newCategory.imagePath) {
        newCategory.imagePath = "default_category_img.jpg"
    }
    categoryDatabase.push(newCategory)
    res.redirect("/29709229/category_list")
})

/**
 * serve the Category List page and render categories in database
 * @name get/29709229/category_list
 * @function
 * @param {string} path
 * @param {Function} callback
 */
app.get("/29709229/category_list", function(req, res) {
    res.render("category_list.html", {categories: categoryDatabase})
})

/**
 * serve the Category List page and search using query parameters
 * @name get/29709229/category_list/:keyword
 * @function
 * @param {string} path
 * @param {Function} callback
 */
app.get("/29709229/category_list/:keyword", function(req, res) {
    res.render("category_list.html", {categories: categoryDatabase})
})

/**
 * serve the Delete Category by ID html page
 * @name get/29709229/delete_category_by_id
 * @function
 * @param {string} path
 * @param {Function} callback
 */
app.get("/29709229/delete_category_by_id", function(req, res) {
    res.render("delete_category.html")
})

/**
 * removes a Category from the database by ID
 */
app.post("/29709229/delete_category_by_id/submit", function(req, res) {
    for (let i = 0; i < categoryDatabase.length; i++) {
        if (categoryDatabase[i].id == req.body.category_id) {
            categoryDatabase.splice(i, 1)
        }
    }
    res.redirect("/29709229/category_list")
})

/**
 * serve the Event Details html page as per event_id
 * @name get/ziyang/event_details/:event_id
 * @function
 * @param {string} path
 * @param {Function} callback
 */

app.get("/29709229/event_details/:event_id", function(req, res) {
    //res.render(VIEW_PATH + "event_details.html")
    let eventId = req.params.event_id
    let eventToRender = null
    for (let i = 0; i < eventDatabase.length; i++) {
        if (eventDatabase[i].id == eventId) {
            eventToRender = eventDatabase[i]
        }
    }
    res.render("event_details.html", {event: eventToRender})
}) 