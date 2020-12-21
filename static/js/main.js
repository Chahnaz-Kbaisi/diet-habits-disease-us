// console.log('hi');
d3.json("/tasks").then((tasks) => {
    // console.log(tasks);
    var list = d3.select("#tasks");


    tasks.forEach((task) => {
        var item = list.append("li");
        item.classed("list-group-item", true);
        item.text(task.description);
    });
});
d3.select("#add-new-task").on("click", () => {
    // console.log("clicked");
    var input = d3.select("#new-task");
    var value = input.property("value");
    // console.log(value);
    var data = {
        task: value
    };
    d3.json('/task', {
        method: 'POST',
        body: JSON.stringify(data)
    }).then(() => {
        console.log("submitted!");
    });
});

