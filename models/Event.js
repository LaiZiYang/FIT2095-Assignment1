class Event {
    constructor(id, name, description, startDateTime, duration, isActive, imagePath, capacity, ticketsAvailable, categoryId) {
        this.id = id
        this.name = name
        this.description = description
        this.startDateTime = new Date(startDateTime)
        this.duration = parseInt(duration)
        this.endDateTime = new Date(this.startDateTime.getTime() + this.duration*60000)
        this.isActive = isActive == "true" ? true : false
        this.imagePath = imagePath
        this.capacity = parseInt(capacity)
        this.ticketsAvailable = ticketsAvailable ? parseInt(ticketsAvailable) : this.capacity
        this.categoryId = categoryId
        this.detailsLink = "/29709229/event_details/" + this.id
    }

    prettyPrintDateTime (date) {
        return `Date: ${date.toLocaleString()}`
    }
}

module.exports = Event;