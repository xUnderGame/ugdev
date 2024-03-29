import { dragDrop, dragOver, openGUI } from "./index.js"; // Probably not the best way to do it!

// Tierlist class.
export class Tierlist {
    tiers;
    hold;
    constructor(tiers = null, holding = null) {
        this.tiers = [];
        this.hold = new Tier("holding");
        if (tiers) tiers.forEach(tier => this.createTier(tier));
        if (holding) this.hold = holding;
    }

    // Moves an element from a tier a different one.
    moveTo(field, moveTo, moveFrom = null) {
        let refFrom = this.tiers.find(tier => tier == moveFrom);
        let refTo = this.tiers.find(tier => tier == moveTo);
        if ((refFrom == undefined && moveFrom != this.hold && moveFrom != null) || (refTo == undefined && moveTo != this.hold)) return;
        
        // Moves it to the specified tier.
        moveTo.add(field);
        if (moveFrom != null) {
            if (moveFrom == this.hold) refFrom = this.hold;
            refFrom.remove(field);
        }
    }

    // Creates a field and adds it to holding.
    createField(fieldName, fieldImg, fieldUrl = null, move = null) {
        // Create the object and move it to holding (or not).
        let field = new Field(fieldName, fieldImg, fieldUrl);
        if (!move) this.moveTo(field, this.hold);
    
        // Creates the element in html.
        let fieldHtml = document.createElement("img");
        fieldHtml.addEventListener("dragstart", function (e) { e.dataTransfer.setData("text", e.target.id); }, false);
        fieldHtml.addEventListener("click", function () { window.open(field.url, "_blank") }, false);
        fieldHtml.classList.add("field");
        fieldHtml.title = field.name;
        fieldHtml.src = field.image;
        fieldHtml.id = field.name;
        fieldHtml.draggable = true;

        // Adds the element to the holder container.
        let holder;
        if (!move) holder = document.querySelector("#holding section");
        else holder = document.querySelector(`#${move} section`);
        holder.appendChild(fieldHtml);
    }

    // Creates a tier in HTML and saves it as an object in tierlist.
    createTier(tier) {
        // We create the elements in HTML.
        let newTier = document.createElement("article");
        newTier.addEventListener("drop", function () { dragDrop(event) }, false);
        newTier.addEventListener("dragover", function () { dragOver(event) }, false);
        newTier.style.backgroundColor = tier.color;
        newTier.classList.add("tier");
        newTier.id = tier.id;

        let tag = document.createElement("h2");
        tag.addEventListener("click", function (e) { openGUI(tier.id) })
        tag.innerText = tier.id;

        let container = document.createElement("section");
        container.classList.add("container");

        // Add to the list of tiers and DOM.
        newTier.appendChild(tag);
        newTier.appendChild(container);
        document.getElementById("tl").appendChild(newTier);
        this.tiers.push(tier);
    }
}

// Tier class.
export class Tier {
    id;
    container;
    color;
    constructor(tierID, tierCol = "transparent", fields = null) {
        this.id = tierID;
        this.container = [];
        this.color = tierCol;
        if (fields) this.container = fields;
    }

    // Adds a Field to the tier.
    add(field) {
        this.container.push(field);
    }

    // Moves a field to a different position.
    move(toMove, moveTo) {
        let move = this.container.find(field => field == toMove);
        let ref = this.container.findIndex(field => field == moveTo);
        if (ref == -1) return;

        // Moves the field.
        this.container.splice(ref, 0, move);
    }

    // Removes an element from the tier.
    remove(del) {
        let ref = this.container.findIndex(field => field == del);
        if (ref == -1) return;

        // Removes the element.
        this.container.splice(ref, 1);
    }
}

// Field class.
export class Field {
    name;
    image;
    url;
    constructor(fieldName, fieldImg, fieldUrl = null) {
        this.name = fieldName;
        this.image = fieldImg;
        this.url = fieldUrl;
    }
}