class Category {
    constructor(id, name, description, imagePath, dateCreated) {
        this.id = id
        this.name = name
        this.description = description
        this.imagePath = imagePath
        this.createdAt = dateCreated
        this.detailsLink = "/ziyang/category_detail/" + this.id
    }

    prettyPrintDateTime (date) {
        return `Date: ${date.toLocaleString()}`
    }

}

module.exports = Category;