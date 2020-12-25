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

