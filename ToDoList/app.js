import bodyparser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import _ from "lodash";

const app = express();

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema); 

const item1 = new Item({
    name: "Welcome to your to do list!"
});

const item2 = new Item({
    name: "Click + to add a new item"
});

const item3 = new Item({
    name: "<-- Click to delete item"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

app.get('/', function(req, res) {
    Item.find().then((items) => {
        if (items.length === 0) {
            Item.insertMany(defaultItems);
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "Today", newListItems: items});
        }
    });
});

app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName})
        .then((foundList) => {
            if (!foundList) {
                const newList = new List({
                name: customListName,
                items: defaultItems
            });
            newList.save();
            res.redirect("/" + customListName);
        } else {
            res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
        }})
        .catch((err) => {console.log(err);});
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.post("/", function(req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    let item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}).then((foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        }).catch((err) => {console.error(err)});
    }
    
});

app.post("/delete", async function(req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        await Item.findByIdAndRemove(checkedItemId)
            .then(()=>console.log(`Deleted ${checkedItemId} Successfully`))
            .catch((err) => console.log("Deletion Error: " + err));
        res.redirect("/");
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}
            ).then((checkedItemId) => {
                    console.log(`Deleted ${checkedItemId} Successfully`);
                }).catch((err) => console.log("Deletion Error: " + err));
        res.redirect("/" + listName);
    }
});

app.listen(3000, function() {
    console.log("server running on port 3000");
});